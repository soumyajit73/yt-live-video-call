import express from "express";
import ServerConfig from "./config/serverConfig"; // Ensure this file exists and exports PORT correctly
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();

app.use(cors()); // Enable CORS for all routes

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // This allows all origins, consider restricting in production
        methods: ["GET", "POST"] // Allowed methods
    }
});

io.on("connection", (socket) => {
    console.log("new user connected");

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// Start the server and listen on the configured port
server.listen(ServerConfig.PORT, () => {
    console.log(`Server is up at port ${ServerConfig.PORT}`);
});
