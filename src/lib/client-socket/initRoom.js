import { randomId } from "./utils";

// Initialize the room and 
function initRoom(socket) {
  const room = randomId();
  window.roomId = room;

  socket.emit("join", room);

  socket.on("full", (room) => {
    alert("Room " + room + " is full");
  });
}

export default initRoom;
