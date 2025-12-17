const express = require("express");
const router = express.Router();

const {
    createUser,
    getAllUsers,
    getDeletedUsers,
    searchUsers,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    uploadProfilePicture,
    getProfilePicture
} = require("../controllers/userController");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");


// Search users with filters
router.get("/search", adminAuth, searchUsers);

// Get all deleted users
router.get("/deleted", adminAuth, getDeletedUsers);

// Create user
router.post("/add", adminAuth, createUser);

// Get all users
router.get("/", adminAuth, getAllUsers);

// Get user by ID
router.get("/:id", adminAuth, getUserById);

// Update user
router.put("/:id", adminAuth, updateUser);

// Restore deleted user
router.post("/:id/restore", adminAuth, restoreUser);

// Delete user
router.delete("/:id", adminAuth, deleteUser);

// Upload profile picture
router.post("/:id/profile-picture", adminAuth, upload.single('profilePicture'), uploadProfilePicture);

// Get profile picture
router.get("/:id/profile-picture", getProfilePicture);

module.exports = router;