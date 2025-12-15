const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

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
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};
