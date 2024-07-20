"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverConfig_1 = __importDefault(require("./config/serverConfig")); // Ensure this file exists and exports PORT correctly
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const RoomHandler_1 = __importDefault(require("./handlers/roomHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // Enable CORS for all routes
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: "*", // This allows all origins, consider restricting in production
    methods: ["GET", "POST"], // Allowed methods
  },
});
io.on("connection", (socket) => {
  console.log("new user connected");
  (0, RoomHandler_1.default)(socket); // passing socket connection to roomhandler for creation and joining of room
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// Start the server and listen on the configured port
server.listen(serverConfig_1.default.PORT, () => {
  console.log(`Server is up at port ${serverConfig_1.default.PORT}`);
});
