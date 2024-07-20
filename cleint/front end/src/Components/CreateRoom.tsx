import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
const CreateRoom: React.FC = () =>{

    const {socket}= useContext(SocketContext);

    const initRoom = ()=>{
        console.log("initialising a request to create a room",socket)
        socket.emit("create-room");
    }


    return (
        <button 
        onClick={initRoom}
        className="btn btn-secondary">
            Start new meeting in new room
        </button>
    )
}

export default CreateRoom;