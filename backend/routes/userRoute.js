const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/userController");
const adminAuth = require("../middleware/adminAuth");

router.post("/add", adminAuth, createUser);

// future-ready (optional)
// router.get("/", adminAuth, getAllUsers);
// router.get("/:id", adminAuth, getUserById);

module.exports = router;
