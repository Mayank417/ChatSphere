require("dotenv").config(); // Ye line sabse pehli honi chahiye!

 
// ... baaki saare imports iske neeche rakho
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
const onlineUsers = new Map();

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "50mb" })); // Image size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("🚀 ChatSphere Backend Running...");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  // Add user after login
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  // Send message
  socket.on("sendMessage", (data) => {
    const { receiverId } = data;

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", data);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    console.log("❌ User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});