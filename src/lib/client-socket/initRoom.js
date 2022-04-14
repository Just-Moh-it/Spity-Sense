import { randomId } from "./utils";

// Initialize the room and 
function initRoom(socket) {
  const room = randomId();
  window.roomId = room;
  console.log("Room id", window.roomId);

  socket.emit("join", room);

  socket.on("full", (room) => {
    alert("Room " + room + " is full");
  });
}

export default initRoom;
