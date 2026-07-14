const socketIo = require("socket.io");

const socketSetup = (server) => {
  const io = socketIo(server, {
    cors: { origin: "*" },
  });

  let activeUsers = [];

  io.on("connection", (socket) => {
    socket.on("new-user-add", (newUserId) => {
      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({
          userId: newUserId,
          socketId: socket.id,
        });
      }
      console.log("Connected Users", activeUsers);

      io.emit("get-users", activeUsers);
    });

    socket.on("user-disconnect", (userId) => {
      activeUsers = activeUsers.filter((user) => user.userId !== userId);
      io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      io.emit("get-users", activeUsers);
    });
  });
};

module.exports = socketSetup;
