import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { ChatContext } from "../context/ChatContext";
import UserCard from "./UserCard";

const gradients = [
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-fuchsia-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-700",
  "from-orange-400 to-pink-600",
  "from-teal-400 to-cyan-600",
  "from-purple-500 to-indigo-700",
  "from-red-500 to-orange-500",
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-yellow-400 to-orange-500",
  "from-lime-500 to-green-600",
  "from-fuchsia-500 to-purple-700",
  "from-blue-500 to-violet-600",
  "from-rose-500 to-pink-700",
];

const getGradient = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

function Sidebar({
  chats = [],
  users = [],
  loading,
  currentUser,
  onChatCreated,
  onChatDeleted,
}) {
  const navigate = useNavigate();
  const { onlineUsers } = useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [visibleChats, setVisibleChats] = useState(chats);

  const query = search.trim().toLowerCase();

  useEffect(() => {
    setVisibleChats(chats);
  }, [chats]);

  const recentChats = useMemo(() => {
    return visibleChats
      .map((chat) => {
        const otherUser =
          chat.members?.find((member) => member._id !== currentUser?.id) ||
          chat.members?.[0] ||
          {};

        return {
          id: otherUser._id,
          chatId: chat._id,
          name: otherUser.name || "Unknown",
          email: otherUser.email || "",
          profilePic: otherUser.profilePic || "",
          online: onlineUsers.includes(otherUser._id),
          unread: 0,
          message: otherUser.email || "Open chat",
          time: "",
        };
      })
      .filter((chat) => {
        if (!query) return true;
        return (
          chat.name.toLowerCase().includes(query) ||
          chat.email.toLowerCase().includes(query)
        );
      });
  }, [visibleChats, currentUser?.id, onlineUsers, query]);

  const newChatUsers = useMemo(() => {
    if (!query) return [];

    return users.filter((user) => {
      if (user._id === currentUser?.id) return false;
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [users, query, currentUser?.id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const handleChatCreated = (chat) => {
    setVisibleChats((prev) => {
      const exists = prev.some((item) => item._id === chat._id);
      if (exists) return prev;
      return [chat, ...prev];
    });
    onChatCreated?.(chat);
  };

  const handleChatDeleted = (chatId) => {
    setVisibleChats((prev) => prev.filter((chat) => chat._id !== chatId));
  };

  return (
    <aside className="w-[360px] h-screen bg-[#0c1322]/40 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between selection:bg-emerald-500/30 relative overflow-hidden z-10">
      
      {/* Decorative inner glow layer */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.04),transparent_50%)]" />

      {/* Top Section Container */}
      <div className="flex flex-col relative z-[1]">
        
        {/* Current User Profile Card */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-md">
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${getGradient(
                  currentUser?.name
                )} flex items-center justify-center text-lg font-bold text-white shadow-md ring-2 ring-white/20`}
              >
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#090e1a] shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-slate-100 truncate text-[15px] tracking-wide">
                {currentUser?.name}
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active profile
              </p>
            </div>
          </div>
        </div>

        {/* Brand Logo & Stats */}
        <div className="px-5 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
            ChatSphere
          </h1>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-white/[0.05] border border-white/10 text-emerald-400 rounded-full shadow-sm">
            {visibleChats.length} {visibleChats.length === 1 ? 'Chat' : 'Chats'}
          </span>
        </div>

        {/* Modern Search Bar */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/10 focus-within:bg-white/[0.05] rounded-xl px-3.5 py-2.5 transition-all duration-300 shadow-inner group">
            <FiSearch className="text-slate-400 text-base group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent outline-none text-slate-100 text-sm placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>

        {/* Dynamic Section Title */}
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-80">
            {query ? "Start New Chat" : "Recent Chats"}
          </h2>
        </div>
      </div>

      {/* Main Chats List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1.5 relative z-[1] scrollbar-thin scrollbar-thumb-white/5 hover:scrollbar-thumb-white/10">
        {loading ? (
          <div className="text-center text-slate-400 text-xs mt-14 flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading conversations...</span>
          </div>
        ) : query ? (
          newChatUsers.length === 0 ? (
            <div className="text-center text-slate-500 text-xs mt-10 py-6 bg-white/[0.01] rounded-2xl border border-dashed border-white/10 mx-2">
              No users found
            </div>
          ) : (
            newChatUsers.map((user) => (
              <UserCard
                key={user._id}
                mode="user"
                user={{
                  id: user._id,
                  name: user.name,
                  email: user.email,
                  profilePic: user.profilePic || "",
                  online: onlineUsers.includes(user._id),
                  unread: 0,
                  message: user.email,
                  time: "",
                }}
                onChatCreated={handleChatCreated}
                onChatDeleted={handleChatDeleted}
                onSelectComplete={() => setSearch("")}
              />
            ))
          )
        ) : recentChats.length === 0 ? (
          <div className="text-center text-slate-400 text-xs mt-10 px-6 py-8 bg-white/[0.01] rounded-2xl border border-dashed border-white/10 mx-2 leading-relaxed">
            No chats yet. Search users to start a conversation!
          </div>
        ) : (
          recentChats.map((chat) => (
            <UserCard
              key={chat.chatId}
              mode="chat"
              user={chat}
              onChatDeleted={(id) => {
                handleChatDeleted(id);
                onChatDeleted?.(id);
              }}
              onSelectComplete={() => setSearch("")}
            />
          ))
        )}
      </div>

      {/* Premium Footer / Logout */}
      <div className="p-4 border-t border-white/10 bg-white/[0.01] relative z-[1]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 bg-white/[0.02] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-slate-300 hover:text-rose-400 transition-all duration-300 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-md active:scale-[0.98]"
        >
          <FiLogOut className="text-sm" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;