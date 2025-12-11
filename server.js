import { Server } from "socket.io";
import { createServer } from "http";
import { randomUUID } from "crypto";

const port = Number(process.env.SERVER_PORT) || 5000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

httpServer.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${port} is in use. Set a different port via SERVER_PORT or free the port.`);
  } else {
    console.error("HTTP server error:", err);
  }
  process.exit(1);
});

httpServer.listen(port, () => {
  console.log("socket.io listening on port", port);
});

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("send-message", (data) => {
    console.log("new message:", data);
    const payload = { id: randomUUID(), ...data };
    io.emit("new-message", payload);
  });
});
