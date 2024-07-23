import { Socket } from "socket.io";
import {v4 as UUIDv4} from "uuid";
import IRoomParams from "../interfaces/iRoomParams";

const roomHandler = (socket: Socket) => {

    const rooms : Record<string, string[]> = {};
        const createRoom = ()=>{
            const roomId=UUIDv4();// unique room id for multiple connection exchange
                socket.join(roomId);// socket connection enters new room

                rooms[roomId]=[];
                socket.emit("room-created", { roomId });// emission of event from server site
                console.log("room created with id", roomId);
        };

        const joinedRoom = ({roomId, peerId}: IRoomParams) => {
            if(rooms[roomId]){

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

export default roomHandler;