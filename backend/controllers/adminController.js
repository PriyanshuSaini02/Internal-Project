const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/admin");
const { sendPasswordResetEmail } = require("../utils/emailService");

const generateToken = (adminId) =>
    jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: "1d" });

// REGISTER
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ msg: "Admin already exists" });
        }

        // 🔐 bcrypt hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await admin.save();

        const token = generateToken(admin._id);

        res.status(201).json({
            msg: "Admin registered successfully",
            token,
        });
    } catch (err) {
        console.error('Error registering admin:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// LOGIN
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // 🔐 bcrypt compare
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = generateToken(admin._id);

        res.status(200).json({
            msg: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (err) {
        console.error('Error logging in admin:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found with this email" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to admin
        admin.resetPasswordToken = resetToken;
        admin.resetPasswordExpires = resetTokenExpiry;
        await admin.save();

        // Send email
        const emailSent = await sendPasswordResetEmail(admin.email, admin.name, resetToken);

        if (emailSent) {
            res.status(200).json({
                msg: "Password reset email sent successfully"
            });
        } else {
            res.status(500).json({
                msg: "Error sending password reset email"
            });
        }
    } catch (err) {
        console.error('Error in forgot password:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        admin.password = hashedPassword;
        admin.resetPasswordToken = null;
        admin.resetPasswordExpires = null;
        await admin.save();

        res.status(200).json({
            msg: "Password reset successfully"
        });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};

// VERIFY RESET TOKEN
exports.verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const admin = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.status(400).json({ msg: "Invalid or expired reset token" });
        }

        res.status(200).json({
            msg: "Token is valid",
            adminEmail: admin.email
        });
    } catch (err) {
        console.error('Error verifying reset token:', err);
        res.status(500).json({ msg: "Server Error" });
    }
};