const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createChat,
  getUserChats,
  deleteChat,
} = require("../controllers/chatController");

// Create Chat
router.post("/", protect, createChat);

// Get My Chats
router.get("/", protect, getUserChats);

// Delete Chat
router.delete("/:chatId", protect, deleteChat);

module.exports = router;