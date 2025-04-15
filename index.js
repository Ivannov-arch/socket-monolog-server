import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" }, // Izinkan akses dari semua domain
});

    const users = new Map(); // Simpan user ID dan socket ID

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      // Simpan user saat bergabung
      socket.on("registerUser", (userId) => {
        users.set(userId, socket.id);
        console.log(`${userId} registered with socket ${socket.id}`);
      });

      // Kirim pesan ke user tertentu
      socket.on("sendMessage", ({ toUserId, message }) => {
        const targetSocketId = users.get(toUserId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("receiveMessage", message);
        }
      });

      // Hapus user saat disconnect
      socket.on("disconnect", (userId) => {
        users.forEach((value, key) => {
          if (value === socket.id) {
            users.delete(key);
          }
        });
        console.log(`${userId} disconnected:`, socket.id);
      });
    });

    (global).io = io;
  
server.listen(3002, () => console.log("WebSocket server berjalan di port 3002"));