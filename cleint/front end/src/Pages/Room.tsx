import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useEffect,useContext } from "react";
const Room: React.FC = () =>{

    const{id} = useParams();
    const {socket}=useContext(SocketContext);

    useEffect(()=>{
        socket.emit("joined-room", {roomId: id});

    },[]);
    return(
        <div>
            room: {id}
        </div>
    )
}

export default Room