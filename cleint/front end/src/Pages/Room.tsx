// import { useParams } from "react-router-dom";
// import { SocketContext } from "../context/SocketContext";
// import { useEffect,useContext } from "react";
 
// const Room: React.FC = () =>{

//     const{id} = useParams();
//     const {socket,user}=useContext(SocketContext);

//     const fetchParticipantList=({roomId, participants}: {roomId: string, participants: string[]})=>{
//         console.log("fetch room participants");
//         console.log(roomId, participants);

//     useEffect(()=>{
        
//       if(user) {
//                 console.log("new user with id", user._id, "has joined room", id);
//                 socket.emit("joined-room", {roomId: id, peerId: user._id});
//                 socket.on("get-users",fetchParticipantList);
//       } 

//     },[id,user,socket]);
//     return(
//         <div>
//             room: {id}
//         </div>
//     )
// }
// }

// export default Room

import { useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useEffect, useContext } from "react";
import UserFeedPlayer from "../Components/UserFeedPlayer";

const Room: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Ensure id is a string
    const { socket, user, stream, peers } = useContext(SocketContext);

    useEffect(() => {
        if (user && id) {
            console.log("New user with id", user.id, "has joined room", id);
            socket.emit("joined-room", { roomId: id, peerId: user.id });
        }
        console.log(peers);
    }, [id, user, socket,peers]);

    // Debugging peers
    useEffect(() => {
        console.log("Current peers:", peers);
    }, [peers]);

    return (
        <div>
            Room: {id}
            <div>Your feed:</div>
            <UserFeedPlayer stream={stream} />

            <div>
                Other users' feeds:
                {Object.keys(peers).length === 0 ? (
                    <div>No other users online.</div>
                ) : (
                    Object.keys(peers).map(peerId => (
                        <UserFeedPlayer key={peerId} stream={peers[peerId]} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Room;
