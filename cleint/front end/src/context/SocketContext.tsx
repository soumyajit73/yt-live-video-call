import SocketIoClient from "socket.io-client";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Peer from "peerjs";
import {v4 as UUIDv4} from "uuid";
const WS_Server = "http://localhost:5500";

export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server,{
    withCredentials:false, 
    transports: ["polling", "websocket"]
});

interface Props{
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({children})=>{
    const navigate = useNavigate();
     const [user,setUser]=useState<Peer>();

     const fetchParticipantList=({roomId, participants}: {roomId: string, participants: string[]})=>{
        console.log("fetch room participants");
        console.log(roomId, participants);
     }
    useEffect(() =>{

        const userId = UUIDv4();
        const newPeer = new Peer(userId);
        setUser(newPeer); 

            const enterRoom=({roomId}: {roomId: String}) => {
                navigate(`/room/${roomId}`);
            }
            //transfer user to room page after collecting event of room-crfreated from server
            socket.on("room-created", enterRoom);
            socket.on("get-users",fetchParticipantList);
    },[] )  


    return (
        <SocketContext.Provider value={{socket,user}}>

        {children}
        </SocketContext.Provider>
    )
}