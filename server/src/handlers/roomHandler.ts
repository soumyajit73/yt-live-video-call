import { Socket } from "socket.io";
import {v4 as UUIDv4} from "uuid";
const roomHandler = (socket: Socket) => {
        const createRoom = ()=>{
            const roomId=UUIDv4();// unique room id for multiple connection exchange
                socket.join(roomId);// socket connection enters new room
                socket.emit("room-created", { roomId });// emission of event from server site
                console.log("room created with id", roomId);
        };

        const joinRoom = ({roomId}:{roomId: string}) => {
            console.log("New user joined the room ",roomId);
        };


        socket.on("create-room", createRoom);
        socket.on("join-room", joinRoom);
};

export default roomHandler;