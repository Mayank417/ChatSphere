import { io } from "socket.io-client";

// Yahan VITE_SOCKET_URL use kar rahe hain jo tune Vercel mein add kiya tha
const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true, // Ye zaroori hai agar backend aur frontend different domains pe hain
    transports: ["websocket"] // Ye connection fast banata hai
});

export default socket;