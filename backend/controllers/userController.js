const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");

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
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
