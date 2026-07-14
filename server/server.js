const app = require("./app");
const http = require("http");
const socketSetup = require("./socket/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
socketSetup(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
