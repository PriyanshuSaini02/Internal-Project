const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
} = require("../controllers/adminController");

router.get("/", (req, res) => {
    res.send("success");
});

// POST /api/admin/register
router.post("/register", registerAdmin);

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/logout
// router.post("/logout", logoutAdmin);

module.exports = router;
