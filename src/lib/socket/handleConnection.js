import setupWebRTCSignaling from "./setupWebRTCSignaling";
import setupRealtimeTranscription from "./setupLiveDeepgramTranscript";

// Max number of clients connected in one room
// TODO: Set max client to 1
const MAX_CLIENTS = 2;

export default function handle_connection({ socket, io }) {
  // Get all rooms in the current socket
  const rooms = io.of("/").adapter.rooms;

  // Do this when a user is joined in a room
  socket.on("join", (room) => {
    // Get number of clients connected
    console.log("Joined room", room);
    let clientsCount = 0;
    if (rooms[room]) {
      clientsCount = rooms[room].length;
    }

    // Check if max numer of clients are already connected
    if (clientsCount >= MAX_CLIENTS) {
      // Emit already full error
      socket.emit("full", room);
    } else {
      // Else, connect the user to the socket
      socket.join(room);
      socket.broadcast.to(room).emit("user-joined", socket.id);

      // Setup 3rd party scripts
      setupWebRTCSignaling({ socket });
      setupRealtimeTranscription({ socket, room });

      // Listen for disconnections
      socket.on("disconnect", () => {
        socket.broadcast.to(room).emit("bye", socket.id);
      });
    }
  });

  return;
}
