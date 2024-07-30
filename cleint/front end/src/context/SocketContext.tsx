// import SocketIoClient from "socket.io-client";
// import { createContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useState } from "react";
// import Peer from "peerjs";
// import {v4 as UUIDv4} from "uuid";
// const WS_Server = "http://localhost:5500";

// export const SocketContext = createContext<any | null>(null);

// const socket = SocketIoClient(WS_Server,{
//     withCredentials:false, 
//     transports: ["polling", "websocket"]
// });

// interface Props{
//     children: React.ReactNode
// }

// export const SocketProvider: React.FC<Props> = ({children})=>{
//     const navigate = useNavigate();
//      const [user,setUser]=useState<Peer>();

//      const fetchParticipantList=({roomId, participants}: {roomId: string, participants: string[]})=>{
//         console.log("fetch room participants");
//         console.log(roomId, participants);
//      } 
//     useEffect(() =>{

//         const userId = UUIDv4();
//         const newPeer = new Peer(userId);
//         setUser(newPeer); 

//             const enterRoom=({roomId}: {roomId: String}) => {
//                 navigate(`/room/${roomId}`);
//             }
//             //transfer user to room page after collecting event of room-crfreated from server
//             socket.on("room-created", enterRoom);
//             socket.on("get-users",fetchParticipantList);
//     },[] )  


//     return (
//         <SocketContext.Provider value={{socket,user}}>

//         {children}
//         </SocketContext.Provider>
//     )
// }

import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";

const WS_Server = "http://localhost:5500";

export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

interface Props {
    children: React.ReactNode;
}

// Define actions and reducer
const ADD_PEER = 'ADD_PEER';

const peerReducer = (state: any, action: any) => {
    switch (action.type) {
        case ADD_PEER:
            return { ...state, [action.payload.peerId]: action.payload.stream };
        default:
            return state;
    }
};

// Define action creator
const addPeerAction = (peerId: string, stream: MediaStream) => ({
    type: ADD_PEER,
    payload: { peerId, stream }
});

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, dispatch] = useReducer(peerReducer, {});

    const fetchParticipantList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("fetch room participants");
        console.log("Room ID:", roomId);
        console.log("Participants:", participants);
    };

    const fetchUserFeed = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(stream);
        } catch (error) {
            console.error("Error fetching user media:", error);
        }
    };

    useEffect(() => {
        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp"
        });
        setUser(newPeer);

        fetchUserFeed();

        const enterRoom = ({ roomId }: { roomId: string }) => {
            console.log("Entering room with ID:", roomId);
            navigate(`/room/${roomId}`);
            socket.emit("joined-room", { roomId, peerId: userId });
        };

        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipantList);

        return () => {
            socket.off("room-created", enterRoom);
            socket.off("get-users", fetchParticipantList);
        };
    }, [navigate]);

    useEffect(() => {
        if (!user || !stream) return;

        const handleUserJoined = ({ peerId }: { peerId: string }) => {
            const call = user.call(peerId, stream);
            console.log("Calling the new peer", peerId);
            call.on("stream", (stream) => {
                dispatch(addPeerAction(peerId, stream));
            });
        };

        user.on("call", (call) => {
            console.log("Receiving a call");
            call.answer(stream);
            call.on("stream", (stream) => {
                dispatch(addPeerAction(call.peer, stream));
            });
        });

        socket.on("user-joined", handleUserJoined);
        socket.emit("ready");

        return () => {
            socket.off("user-joined", handleUserJoined);
        };
    }, [user, stream]);

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    );
};
