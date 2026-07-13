const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getUsers,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// Get all users
router.get("/", protect, getUsers);

// Get logged-in user's profile
router.get("/profile", protect, getProfile);

// Update profile
router.put(
  "/profile",
  protect,
  upload.single("profilePic"),
  updateProfile
);

module.exports = router;