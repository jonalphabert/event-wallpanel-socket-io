import { Server } from "socket.io";
import { createServer } from "http";
import { randomUUID } from "crypto";

const port = Number(process.env.SERVER_PORT) || 5000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" },
});
let active = 0;

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
setInterval(() => {
  const m = process.memoryUsage();
  console.log(JSON.stringify({ ts: Date.now(), active, rss: m.rss, heapUsed: m.heapUsed, external: m.external }));
}, 5000);

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);
  active += 1;

  socket.on("send-message", (data) => {
    console.log("new message:", data);
    const payload = { id: randomUUID(), ...data };
    io.to("display").emit("new-message", payload);
  });
  socket.on("register-display", () => {
    socket.join("display");
  });
  socket.on("disconnect", () => {
    active -= 1;
  });
});
