const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.adminId);
        if (!admin) {
            return res.status(401).json({ msg: "Invalid admin token" });
        }

        req.admin = admin; // 🔑 used in createUser
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
};
