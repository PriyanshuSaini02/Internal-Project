const express = require("express");
const router = express.Router();

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfilePicture,
    getProfilePicture
} = require("../controllers/userController");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");


// Create user
router.post("/add", adminAuth, createUser);

// Get all users
router.get("/", adminAuth, getAllUsers);

// Get user by ID
router.get("/:id", adminAuth, getUserById);

// Update user
router.put("/:id", adminAuth, updateUser);

// Delete user
router.delete("/:id", adminAuth, deleteUser);

// Upload profile picture
router.post("/:id/profile-picture", adminAuth, upload.single('profilePicture'), uploadProfilePicture);

// Get profile picture
router.get("/:id/profile-picture", getProfilePicture);

module.exports = router;