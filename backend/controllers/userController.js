const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const { sendUserCredentials } = require("../utils/emailService");
const path = require('path');
const fs = require('fs');

exports.createUser = async (req, res) => {
    const {
        name,
        email,
        dob,
        project,
        address,
        phoneNumber,
    } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // UUIDs without external lib
        const userId = crypto.randomUUID();
        const rawPassword = crypto.randomUUID().slice(0, 8);

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const user = new User({
            userId,
            name,
            email,
            password: hashedPassword,
            dob,
            userManager: req.admin._id,
            project,
            address,
            phoneNumber,
        });

        await user.save();

        // Send email with credentials
        const emailSent = await sendUserCredentials(email, name, rawPassword);

        res.status(201).json({
            msg: "User created successfully",
            user: {
                userId,
                name,
                email,
            },
            credentials: {
                password: rawPassword,
            },
            emailSent: emailSent
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 });
        res.status(200).json({
            msg: "Users retrieved successfully",
            users: users
        });
    } catch (err) {
        console.error('Error getting users:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id }, '-password');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({
            msg: "User retrieved successfully",
            user: user
        });
    } catch (err) {
        console.error('Error getting user:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
    const { name, email, dob, project, address, phoneNumber } = req.body;

    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: "Email already exists" });
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (dob) user.dob = dob;
        if (project) user.project = project;
        if (address) user.address = address;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        res.status(200).json({
            msg: "User updated successfully",
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                dob: user.dob,
                project: user.project,
                address: user.address,
                phoneNumber: user.phoneNumber
            }
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Delete profile picture if exists
        if (user.profilePicture) {
            const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await User.deleteOne({ userId: req.params.id });

        res.status(200).json({
            msg: "User deleted successfully"
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const user = await User.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Delete old profile picture if exists
        if (user.profilePicture) {
            const oldImagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update user with new profile picture path
        const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
        user.profilePicture = profilePicturePath;
        await user.save();

        res.status(200).json({
            msg: "Profile picture uploaded successfully",
            profilePicture: profilePicturePath
        });
    } catch (err) {
        console.error('Error uploading profile picture:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// Get user profile picture
exports.getProfilePicture = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user || !user.profilePicture) {
            return res.status(404).json({ msg: "Profile picture not found" });
        }

        const imagePath = path.join(__dirname, '../uploads/profiles', path.basename(user.profilePicture));
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ msg: "Profile picture file not found" });
        }

        res.sendFile(imagePath);
    } catch (err) {
        console.error('Error getting profile picture:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};