"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const roomHandler = (socket) => {
  const createRoom = () => {
    const roomId = (0, uuid_1.v4)(); // unique room id for multiple connection exchange
    socket.join(roomId); // socket connection enters new room
    socket.emit("room-created", { roomId }); // emission of event from server site
    console.log("room created with id", roomId);
  };
  const joinRoom = () => {
    console.log("New room joined");
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
};
exports.default = roomHandler;
