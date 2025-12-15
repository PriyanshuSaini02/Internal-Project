const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    forgotPassword,
    resetPassword,
    verifyResetToken
} = require("../controllers/adminController");

router.get("/", (req, res) => {
    res.send("Admin routes working");
});

// POST /api/admin/register
router.post("/register", registerAdmin);

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/admin/reset-password
router.post("/reset-password", resetPassword);

// GET /api/admin/verify-reset-token/:token
router.get("/verify-reset-token/:token", verifyResetToken);

module.exports = router;