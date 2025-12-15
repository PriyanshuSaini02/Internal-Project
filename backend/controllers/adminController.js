const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { sendPasswordResetEmail } = require("../utils/emailService");

// ================= JWT HELPERS =================
const generateAuthToken = (adminId) =>
    jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: "1d" });

const generateResetToken = (adminId) =>
    jwt.sign(
        { adminId, purpose: "password_reset" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );


// ================= REGISTER =================
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await Admin.findOne({ email });
        if (exists) {
            return res.status(400).json({ msg: "Admin already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashed
        });

        const token = generateAuthToken(admin._id);

        res.status(201).json({
            msg: "Admin registered successfully",
            token
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};


// ================= LOGIN =================
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = generateAuthToken(admin._id);

        res.json({
            msg: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};


// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        // JWT reset token (1 hour expiry)
        const resetToken = generateResetToken(admin._id);

        await sendPasswordResetEmail(admin.email, admin.name, resetToken);

        res.json({ msg: "Password reset email sent" });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};


// ================= VERIFY RESET TOKEN =================
exports.verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== "password_reset") {
            return res.status(400).json({ msg: "Invalid token" });
        }

        res.json({ msg: "Token is valid" });
    } catch (err) {
        res.status(400).json({ msg: "Invalid or expired token" });
    }
};


// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.purpose !== "password_reset") {
            return res.status(400).json({ msg: "Invalid token" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        await Admin.findByIdAndUpdate(decoded.adminId, {
            password: hashed
        });

        res.json({ msg: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ msg: "Invalid or expired token" });
    }
};
