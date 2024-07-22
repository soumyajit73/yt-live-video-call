import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useEffect,useContext } from "react";

const Room: React.FC = () =>{

    const{id} = useParams();
    const {socket,user}=useContext(SocketContext);

    useEffect(()=>{
        
      if(user) {
                console.log("new user with id", user._id, "has joined room", id);
                socket.emit("joined-room", {roomId: id, peerId: user._id});
      } 

    },[id,user,socket]);
    return(
        <div>
            room: {id}
        </div>
    )
}

export default Room