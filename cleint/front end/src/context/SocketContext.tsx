import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerAction";
import SocketIoClient from "socket.io-client";

const WS_Server = "http://localhost:5500";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

interface Props {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate(); // Programmatically handle navigation

    const [user, setUser] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, dispatch] = useReducer(peerReducer, {}); // peers->state

    const fetchParticipantList = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("Fetched room participants", roomId, participants);
    };

    const fetchUserFeed = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    useEffect(() => {
        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: "localhost",
            port: 9000,
            path: "/myapp",
            debug: 3 // Debugging level to track connection status
        });

        setUser(newPeer);
        fetchUserFeed();

        const enterRoom = ({ roomId }: { roomId: string }) => {
            navigate(`/room/${roomId}`);
        };

        // Socket event listeners
        socket.on("room-created", enterRoom);
        socket.on("get-users", fetchParticipantList);

        return () => {
            newPeer.destroy();
            socket.off("room-created", enterRoom);
            socket.off("get-users", fetchParticipantList);
        };
    }, [navigate]);

    useEffect(() => {
        if (!user || !stream) return;

        socket.on("user-joined", ({ peerId }: { peerId: string }) => {
            const call = user.call(peerId, stream);

            call.on("stream", (remoteStream: MediaStream) => {
                console.log("Received remote stream from peer:", peerId);
                dispatch(addPeerAction(peerId, remoteStream));
            });

            call.on("error", (err) => {
                console.error("Call error:", err);
            });

            call.on("close", () => {
                console.log(`Call with ${peerId} closed`);
            });
        });

        user.on("call", (call) => {
            console.log("Receiving a call from", call.peer);
            call.answer(stream);

            call.on("stream", (remoteStream: MediaStream) => {
                console.log("Received remote stream during call from peer:", call.peer);
                dispatch(addPeerAction(call.peer, remoteStream));
            });

            call.on("error", (err) => {
                console.error("Call error:", err);
            });

            call.on("close", () => {
                console.log(`Call with ${call.peer} closed`);
            });
        });

        socket.emit("ready");

        return () => {
            socket.off("user-joined");
            user.off("call");
        };
    }, [user, stream, dispatch]);

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </SocketContext.Provider>
    );
};
