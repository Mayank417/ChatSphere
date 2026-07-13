import { useContext, useState } from "react";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { ChatContext } from "../context/ChatContext";
import { createChat, deleteChat } from "../services/chatService";

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

function UserCard({
  user,
  mode = "chat",
  onChatCreated,
  onSelectComplete,
  onChatDeleted,
}) {
  const { setSelectedChat } = useContext(ChatContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = async () => {
    try {
      if (mode === "chat") {
        setSelectedChat(user);
        onSelectComplete?.();
        return;
      }

      const res = await createChat(user.id);

      const selected = {
        id: user.id,
        chatId: res.data._id,
        name: user.name,
        email: user.email || "",
        profilePic: user.profilePic || "",
        online: user.online || false,
        unread: 0,
        message: user.email || "",
        time: "",
      };

      setSelectedChat(selected);
      onChatCreated?.(res.data);
      onSelectComplete?.();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteChat = async (e) => {
    e.stopPropagation();

    const ok = window.confirm(
      `Delete chat with ${user.name}? This will remove the chat and all messages.`
    );

    if (!ok) {
      setShowMenu(false);
      return;
    }

    try {
      await deleteChat(user.chatId);
      setShowMenu(false);
      setSelectedChat(null);
      onChatDeleted?.(user.chatId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-800/40 border border-transparent hover:border-slate-700/30 hover:shadow-md"
    >
      <div className="flex items-center gap-3.5">
        {/* Avatar Setup */}
        <div className="relative">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient(
              user.name
            )} flex items-center justify-center text-xl font-bold text-white shadow-md`}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </div>

          {user.online && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0e1524] shadow-sm"></span>
          )}
        </div>

        {/* Text Info */}
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{user.name}</h3>
          <p className="text-xs text-slate-400 truncate w-36 mt-0.5">
            {user.message}
          </p>
        </div>
      </div>

      {/* Right Side Options / Unread Badge */}
      <div className="flex items-center gap-2 relative">
        {user.unread > 0 && (
          <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500/90 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            {user.unread}
          </div>
        )}

        {mode === "chat" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-500 hover:text-emerald-400 hover:bg-slate-800/60 p-2 rounded-full"
          >
            <FiMoreVertical size={16} />
          </button>
        )}

        {/* Floating Glassmorphism Menu */}
        {showMenu && mode === "chat" && (
          <div className="absolute right-0 top-10 w-44 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
            <button
              onClick={handleDeleteChat}
              className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 text-sm font-medium transition-colors"
            >
              <FiTrash2 size={16} className="text-rose-500/80" />
              Delete Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCard;