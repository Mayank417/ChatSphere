const Chat = require("../models/Chat");
const Message = require("../models/Message");

// Create New Chat
const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "receiverId is required",
      });
    }

    const existingChat = await Chat.findOne({
      members: { $all: [req.user._id, receiverId] },
    }).populate("members", "-password");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    let chat = await Chat.create({
      members: [req.user._id, receiverId],
    });

    chat = await Chat.findById(chat._id).populate("members", "-password");

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Chats of Logged-in User
const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: req.user._id,
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Chat + Messages
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const isMember = chat.members.some(
      (member) => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to delete this chat",
      });
    }

    await Message.deleteMany({
      chatId: req.params.chatId,
    });

    await Chat.findByIdAndDelete(req.params.chatId);

    res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createChat,
  getUserChats,
  deleteChat,
};