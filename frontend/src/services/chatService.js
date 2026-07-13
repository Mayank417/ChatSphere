import API from "./api";

// Create Chat
export const createChat = (receiverId) =>
  API.post("/chat", {
    receiverId,
  });

// Get All Chats
export const getChats = () => API.get("/chat");

// Delete Chat
export const deleteChat = (chatId) =>
  API.delete(`/chat/${chatId}`);