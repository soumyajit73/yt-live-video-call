"use strict";
// import { Socket } from "socket.io";
// import {v4 as UUIDv4} from "uuid";
// import IRoomParams from "../interfaces/iRoomParams";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const rooms = {};
const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = (0, uuid_1.v4)(); // unique room id for multiple connection exchange
        socket.join(roomId); // socket connection enters new room
        rooms[roomId] = [];
        socket.emit("room-created", { roomId }); // emission of event from server site
        console.log("room created with id", roomId);
    };
    const joinedRoom = ({ roomId, peerId }) => {
        console.log("joined room called with roomId:", roomId, "and peerId:", peerId);
        console.log("Current rooms state:", rooms);
        if (rooms[roomId]) {
            // Check if the peerId already exists in the room to avoid duplicates
            if (!rooms[roomId].includes(peerId)) {
                console.log("New user joined the room", roomId, "with peer id as", peerId);
                rooms[roomId].push(peerId);
                console.log("added peer to room. Updated rooms state:", rooms);
                socket.join(roomId);
                socket.on("ready", () => {
                    socket.to(roomId).emit("user-joined", { peerId });
                });
                socket.emit("get-users", {
                    roomId,
                    participants: rooms[roomId]
                });
                console.log("Emitted get-users event with participants:", rooms[roomId]);
            }
            else {
                console.log("Peer ID already exists in the room:", peerId);
            }
        }
        else {
            console.log("Room not found with id:", roomId);
        }
    };
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};
exports.default = roomHandler;
