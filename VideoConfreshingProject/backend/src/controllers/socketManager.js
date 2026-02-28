import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // ================= JOIN CALL =================
    socket.on("join-call", (path) => {
      socket.join(path);

      if (!connections[path]) connections[path] = [];
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      const clients = Array.from(io.sockets.adapter.rooms.get(path) || []);
      const otherClients = clients.filter((id) => id !== socket.id);

      io.to(socket.id).emit("existing-users", otherClients);
      socket.to(path).emit("user-joined", socket.id);
    });

    // ================= SIGNAL =================
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    // ================= CHAT =================
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) return [roomKey, true];
          return [room, isFound];
        },
        ["", false]
      );

      if (found) {
        if (!messages[matchingRoom]) messages[matchingRoom] = [];
        messages[matchingRoom].push({ sender, data, "socket-id-sender": socket.id });

        connections[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);

      for (const [k, v] of Object.entries(connections)) {
        if (v.includes(socket.id)) {
          v.forEach((id) => {
            if (id !== socket.id) io.to(id).emit("user-left", socket.id);
          });
          connections[k] = v.filter((id) => id !== socket.id);
          if (connections[k].length === 0) delete connections[k];
        }
      }
    });
  });

  return io;
};
