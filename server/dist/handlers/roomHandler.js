"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const roomHandler = (socket) => {
    const rooms = {};
    const createRoom = () => {
        const roomId = (0, uuid_1.v4)(); // unique room id for multiple connection exchange
        socket.join(roomId); // socket connection enters new room
        rooms[roomId] = [];
        socket.emit("room-created", { roomId }); // emission of event from server site
        console.log("room created with id", roomId);
    };
    const joinedRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            console.log("New user joined the room ", roomId, "with peer id as", peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.emit("get-users", {
                roomId,
                participants: rooms[roomId]
            });
        }
    };
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};
exports.default = roomHandler;
