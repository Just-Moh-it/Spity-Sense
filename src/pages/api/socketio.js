import { Server as ServerIO } from "socket.io";
import { config as initDotenv } from "dotenv";
initDotenv();
import handle_connection from "../../lib/socket/handleConnection";

// Throw error if Deepgram key is not set
if (!process.env.DG_KEY) {
  throw "You must define DG_KEY in your .env file";
}

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    // Initialize Web Sockets
    console.log("*First use, starting socket.io");

    // Create http and ws server
    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    // Listen for active connections
    io.on("connect", (socket) => {
      // Handle all the aftermath and the subsequent connections from ws
      handle_connection({ socket, io });
    });

    // Set socket in memory for later use
    res.socket.server.io = io;
  }
  // Else, the server ws server is already initialized

  // End the response
  res.end();
};

// API Config
export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
