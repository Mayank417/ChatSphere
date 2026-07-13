import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getUsers } from "../services/userService";
import { getChats } from "../services/chatService";
import socket from "../socket";
import { ChatContext } from "../context/ChatContext";

function Home() {
  const { setMessages, setOnlineUsers } = useContext(ChatContext);

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("addUser", currentUser.id);
    }

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });

      setChats((prev) => {
        const index = prev.findIndex((chat) => chat._id === message.chatId);
        if (index === -1) return prev;
        const updated = [...prev];
        const [chat] = updated.splice(index, 1);
        updated.unshift(chat);
        return updated;
      });
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("getOnlineUsers");
    };
  }, [currentUser, setMessages, setOnlineUsers]);

  const fetchData = async () => {
    try {
      const [chatRes, userRes] = await Promise.all([getChats(), getUsers()]);
      setChats(chatRes.data);
      setUsers(userRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatCreated = (chat) => {
    setChats((prev) => {
      const exists = prev.some((item) => item._id === chat._id);
      if (exists) return prev;
      return [chat, ...prev];
    });
  };

  const handleChatDeleted = (chatId) => {
    setChats((prev) => prev.filter((chat) => chat._id !== chatId));
  };

  return (
    <div className="flex h-screen bg-[#070b14] overflow-hidden relative font-sans antialiased">
      {/* Background Ambient Glow Elements - Perfect for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar Panel */}
      <Sidebar
        chats={chats}
        users={users}
        loading={loading}
        currentUser={currentUser}
        onChatCreated={handleChatCreated}
        onChatDeleted={handleChatDeleted}
      />

      {/* Main Chat Window */}
      <ChatWindow />
    </div>
  );
}

export default Home;