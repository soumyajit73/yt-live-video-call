import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useEffect,useContext } from "react";

const Room: React.FC = () =>{

    const{id} = useParams();
    const {socket,user}=useContext(SocketContext);

    useEffect(()=>{
      if(user)  socket.emit("joined-room", {roomId: id, peerId: user._id});

    },[id]);
    return(
        <div>
            room: {id}
        </div>
    )
}

export default Room