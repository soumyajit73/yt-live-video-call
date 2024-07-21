import SocketIoClient from "socket.io-client";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
    useEffect(() =>{
            const enterRoom=({roomId}: {roomId: String}) => {
                navigate(`/room/${roomId}`);
            }
            //transfer user to room page after collecting event of room-crfreated from server
            socket.on("room-created", enterRoom);
    },[] )  


    return (
        <SocketContext.Provider value={{socket}}>

        {children}
        </SocketContext.Provider>
    )
}