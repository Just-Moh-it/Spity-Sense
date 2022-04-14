export default function setupWebRTCSignaling({ socket }) {
  socket.on("video-offer", (id, message) => {
    socket.to(id).emit("video-offer", socket.id, message);
  });
  socket.on("video-answer", (id, message) => {
    socket.to(id).emit("video-answer", socket.id, message);
  });
  socket.on("ice-candidate", (id, message) => {
    socket.to(id).emit("ice-candidate", socket.id, message);
  });
}
