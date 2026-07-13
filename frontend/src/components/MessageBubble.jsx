import { useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiMoreVertical,
  FiTrash2,
  FiSlash,
  FiDownload,
} from "react-icons/fi";
import {
  deleteForMe,
  deleteForEveryone,
} from "../services/messageService";

function MessageBubble({ message, refreshMessages }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  // Added fallback for _id just in case your auth uses _id instead of id
  const own = message.senderId === currentUser?.id || message.senderId === currentUser?._id;

  const [showMenu, setShowMenu] = useState(false);

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDeleteForMe = async () => {
    try {
      await deleteForMe(message._id);
      refreshMessages?.();
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      await deleteForEveryone(message._id);
      refreshMessages?.();
      setShowMenu(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`flex ${own ? "justify-end" : "justify-start"} mb-4 group`}>
      <div className={`relative max-w-[75%] flex flex-col ${own ? "items-end" : "items-start"}`}>

        {/* Hover Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`absolute -top-3 ${own ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/[0.06] backdrop-blur-sm rounded-full p-1.5 text-slate-400 hover:text-emerald-400 border border-white/10 shadow-sm z-10`}
        >
          <FiMoreVertical size={14} />
        </button>

        {/* Glassmorphism Dropdown Menu */}
        {showMenu && (
          <div className={`absolute top-6 ${own ? "right-0" : "left-0"} w-48 bg-[#0d1420]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden`}>

            <button
              onClick={handleDeleteForMe}
              className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 transition-colors text-sm font-medium border-b border-white/[0.06]"
            >
              <FiTrash2 size={16} className="text-rose-500/80" />
              Delete For Me
            </button>

            {own && (
              <button
                onClick={handleDeleteForEveryone}
                className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 transition-colors text-sm font-medium border-b border-white/[0.06]"
              >
                <FiTrash2 size={16} className="text-rose-500/80" />
                Delete For Everyone
              </button>
            )}

            {/* Download Button strictly checking for valid image URL */}
            {message.image && message.image.trim() !== "" && (
              <button
                onClick={() => window.open(message.image, "_blank")}
                className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium"
              >
                <FiDownload size={16} />
                Download Image
              </button>
            )}
          </div>
        )}

        {/* Main Message Bubble */}
        <div
          className={`relative px-4 pt-2.5 pb-2 shadow-md border backdrop-blur-sm whitespace-pre-wrap break-words w-fit min-w-[90px] transition-all duration-300
          ${
            own
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-md border-emerald-400/20 shadow-emerald-500/10"
              : "bg-white/[0.04] text-slate-100 rounded-2xl rounded-bl-md border-white/[0.07]"
          }`}
        >
          {message.isDeleted ? (
            <div className="flex items-center gap-2 italic opacity-60 text-sm py-1">
              <FiSlash size={14} />
              <p>This message was deleted</p>
            </div>
          ) : (
            <>
              {/* Image renderer strictly checking for valid image URL */}
              {message.image && message.image.trim() !== "" && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="rounded-xl mb-2 max-w-full md:max-w-xs border border-white/10 shadow-sm"
                />
              )}

              <p className="text-[15px] leading-relaxed">
                {message.text}
              </p>
            </>
          )}

          {/* Timestamp and Ticks */}
          <div className="flex justify-end items-center gap-1.5 mt-1">
            <span className={`text-[10px] font-medium tracking-wide ${own ? "text-emerald-50/80" : "text-slate-400"}`}>
              {time}
            </span>

            {own && !message.isDeleted && (
              <span className="ml-0.5">
                {message.seen ? (
                  <FiCheckCircle size={12} className="text-emerald-100" />
                ) : (
                  <FiCheck size={14} className="text-emerald-200/70" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;