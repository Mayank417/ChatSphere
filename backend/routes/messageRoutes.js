const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  sendMessage,
  getMessages,
  deleteForMe,
  deleteForEveryone,
  markMessagesSeen,
} = require("../controllers/messageController");

// Send Message
router.post("/", protect, upload.single("image"), sendMessage);

// Get All Messages of a Chat
router.get("/:chatId", protect, getMessages);

// Mark Messages as Seen
router.put("/:chatId/seen", protect, markMessagesSeen);

// Delete For Me
router.delete("/:messageId", protect, deleteForMe);

// Delete For Everyone
router.put("/:messageId/delete", protect, deleteForEveryone);

module.exports = router;