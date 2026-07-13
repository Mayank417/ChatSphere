import { useContext, useEffect, useState, useRef } from "react";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";

import socket from "../socket";
import { ChatContext } from "../context/ChatContext";
import { getMessages, sendMessage } from "../services/messageService";
import MessageBubble from "./MessageBubble";

const gradients = [
  "from-cyan-500 to-blue-600", "from-violet-500 to-fuchsia-600", "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-700", "from-orange-400 to-pink-600", "from-teal-400 to-cyan-600",
  "from-purple-500 to-indigo-700", "from-red-500 to-orange-500", "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600", "from-yellow-400 to-orange-500", "from-lime-500 to-green-600",
  "from-fuchsia-500 to-purple-700", "from-blue-500 to-violet-600", "from-rose-500 to-pink-700",
];

const getGradient = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

function ChatWindow() {
  const { selectedChat, messages, setMessages } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      markSeen();
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messagesSeen", ({ chatId }) => {
      if (selectedChat && chatId === selectedChat.chatId) {
        setMessages((prev) => 
          prev.map((msg) => ({ ...msg, seen: true }))
        );
      }
    });

    return () => {
      socket.off("messagesSeen");
    };
  }, [selectedChat]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(selectedChat.chatId);
      setMessages(res.data);
    } catch (error) { console.log(error); }
  };

  const markSeen = async () => {
    try {
      if (!user || !user.token) return;
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5001/api/message/${selectedChat.chatId}/seen`, {}, config);
      
      socket.emit("messagesSeen", {
        chatId: selectedChat.chatId,
        senderId: user._id,
      });
    } catch (error) {
      console.log("Error marking seen:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (!text.trim() && !image) return;

    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat.chatId);
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }

      const res = await sendMessage(formData);
      setMessages((prev) => [...prev, res.data]);
      
      socket.emit("sendMessage", { ...res.data, receiverId: selectedChat.id });

      setText("");
      removeImage();
    } catch (error) { 
      console.error(error); 
    }
  };

  // Glassy Empty Screen State
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#070b14]/30 backdrop-blur-md relative z-10">
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 flex flex-col items-center max-w-sm text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
            <span className="text-4xl animate-bounce">💬</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide">Your Space Awaits</h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Select a conversation from the sidebar or search for friends to start encrypting memories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#070b14]/30 backdrop-blur-md relative z-10">
      
      {/* Glass Top Header */}
      <div className="h-20 bg-[#0c1322]/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-20 sticky top-0 shadow-lg">
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getGradient(selectedChat.name)} flex items-center justify-center text-lg font-bold text-white shadow-md ring-2 ring-white/10`}>
            {selectedChat.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-slate-100 tracking-wide">{selectedChat.name}</h2>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]"></span> Active Now
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} refreshMessages={fetchMessages} />
        ))}
      </div>

      {/* Input Action Panel */}
      <div className="p-4 bg-transparent relative flex flex-col z-20">
        {showEmoji && (
          <div className="absolute bottom-24 left-4 z-50 shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
            <EmojiPicker theme="dark" onEmojiClick={(e) => {
              setText((prev) => prev + e.emoji);
              setShowEmoji(false); 
            }} />
          </div>
        )}
        
        {preview && (
          <div className="mb-3 relative w-fit ml-4 bg-white/[0.04] p-1.5 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
            <img src={preview} alt="Selected" className="h-20 w-auto rounded-lg object-cover shadow-sm" />
            <button 
              onClick={removeImage} 
              className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-xl transition-all scale-100 hover:scale-110 active:scale-95"
            >
              <FiX size={12} />
            </button>
          </div>
        )}
        
        {/* Floating Glass Input Deck */}
        <div className="bg-[#0c1424]/60 backdrop-blur-xl border border-white/10 focus-within:border-emerald-500/40 focus-within:shadow-[0_0_20px_rgba(52,211,153,0.15)] rounded-2xl flex items-center gap-2.5 px-4 py-3 transition-all duration-300 shadow-xl">
          <button 
            onClick={() => setShowEmoji(!showEmoji)} 
            className="text-slate-400 hover:text-emerald-400 text-xl transition-colors active:scale-95"
          >
            😊
          </button>

          <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleImageChange} />
          
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="text-slate-400 hover:text-emerald-400 text-lg transition-colors active:scale-95"
          >
            <FiPaperclip />
          </button>
          
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none text-slate-100 text-sm ml-1 placeholder:text-slate-500 font-medium"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button 
            onClick={handleSend} 
            disabled={!text.trim() && !image} 
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-500 shadow-md transition-all flex items-center justify-center active:scale-[0.96]"
          >
            <FiSend size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;