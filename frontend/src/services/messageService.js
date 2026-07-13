import API from "./api";

// Get Messages
export const getMessages = (chatId) =>
  API.get(`/message/${chatId}`);

// Send Message (Update kiya gaya hai FormData ke liye)
export const sendMessage = (formData) =>
  API.post("/message", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete For Me
export const deleteForMe = (messageId) =>
  API.delete(`/message/${messageId}`);

// Delete For Everyone
export const deleteForEveryone = (messageId) =>
  API.put(`/message/${messageId}/delete`);