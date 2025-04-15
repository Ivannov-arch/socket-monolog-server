// socket-server/index.js
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("registerUser", (userId) => {
    users.set(userId, socket.id);
    console.log(`${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", ({ toUserId, message }) => {
    const targetSocketId = users.get(toUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receiveMessage", message);
    }
  });

  socket.on("disconnect", () => {
    for (const [key, value] of users.entries()) {
      if (value === socket.id) users.delete(key);
    }
    console.log(`User disconnected:`, socket.id);
  });
});

server.listen(3002, () => console.log("Socket server berjalan di port 3002"));
