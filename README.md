 # ChatSphere

ChatSphere is a real-time chat application built with the MERN stack and Socket.IO.  
It allows users to register, log in, search users, and chat instantly.

## Features
- User registration and login
- Real-time messaging
- Online users
- Image sharing
- Delete message for me
- Responsive UI

## Tech Stack
- React
- Vite
- Tailwind CSS
- Node.js
- Express
- MongoDB
- Socket.IO

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
Environment Variables
Backend
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Frontend
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Author

Mayank Saini
