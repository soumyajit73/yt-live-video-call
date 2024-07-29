// import { Socket } from "socket.io";
// import {v4 as UUIDv4} from "uuid";
// import IRoomParams from "../interfaces/iRoomParams";

// const roomHandler = (socket: Socket) => {

//     const rooms : Record<string, string[]> = {};
//         const createRoom = ()=>{
//             const roomId=UUIDv4();// unique room id for multiple connection exchange
//                 socket.join(roomId);// socket connection enters new room

//                 rooms[roomId]=[];
//                 socket.emit("room-created", { roomId });// emission of event from server site
//                 console.log("room created with id", roomId);
//         };

//         const joinedRoom = ({roomId, peerId}: IRoomParams) => {
//             console.log("joined room called",rooms);
//             if(rooms[roomId]){

//                 console.log("New user joined the room ", roomId, "with peer id as", peerId);

//                 rooms[roomId].push(peerId);
//                 console.log("added peer to room joined room called",rooms);
//                 socket.join(roomId);


//                 socket.emit("get-users", {
//                     roomId,
//                     participants: rooms[roomId]
//                 });
//             }

//         };


//         socket.on("create-room", createRoom);
//         socket.on("joined-room", joinedRoom);
// };

// export default roomHandler;

import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/iRoomParams";
const rooms: Record<string, string[]> = {};
const roomHandler = (socket: Socket) => {


    const createRoom = () => {
        const roomId = UUIDv4(); // unique room id for multiple connection exchange
        socket.join(roomId); // socket connection enters new room

        rooms[roomId] = [];
        socket.emit("room-created", { roomId }); // emission of event from server site
        console.log("room created with id", roomId);
    };

    const joinedRoom = ({ roomId, peerId }: IRoomParams) => {
        console.log("joined room called with roomId:", roomId, "and peerId:", peerId);
        console.log("Current rooms state:", rooms);

        if (rooms[roomId]) {
            // Check if the peerId already exists in the room to avoid duplicates
            if (!rooms[roomId].includes(peerId)) {
                console.log("New user joined the room", roomId, "with peer id as", peerId);
                rooms[roomId].push(peerId);
                console.log("added peer to room. Updated rooms state:", rooms);
                socket.join(roomId);

                socket.on("ready",()=>{
                    socket.to(roomId).emit("user-joined", {peerId});
                })

                socket.emit("get-users", {
                    roomId,
                    participants: rooms[roomId]
                });
                console.log("Emitted get-users event with participants:", rooms[roomId]);
            } else {
                console.log("Peer ID already exists in the room:", peerId);
            }
        } else {
            console.log("Room not found with id:", roomId);
        }
    };

    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;
