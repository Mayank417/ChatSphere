const Message = require("../models/Message");

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    
    // Naya logic: Agar image aayi hai to link nikal lo
    const image = req.file ? req.file.path : "";

    const message = await Message.create({
      chatId,
      senderId: req.user._id,
      text,
      image, // DB me image ka link save ho jayega
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
      deletedFor: {
        $ne: req.user._id,
      },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete For Me
const deleteForMe = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (!message.deletedFor.includes(req.user._id)) {
      message.deletedFor.push(req.user._id);
      await message.save();
    }

    res.status(200).json({
      message: "Message deleted for you",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete For Everyone
const deleteForEveryone = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own messages",
      });
    }

    message.text = "";
    message.image = "";
    message.isDeleted = true;

    await message.save();

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark Messages as Seen (Naya Function)
const markMessagesSeen = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Jo messages maine nahi bheje, unhe seen: true kar do
    await Message.updateMany(
      { chatId, senderId: { $ne: req.user._id }, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteForMe,
  deleteForEveryone,
  markMessagesSeen,
};