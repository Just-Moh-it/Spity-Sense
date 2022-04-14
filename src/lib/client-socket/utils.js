/**
 * @returns {string} */
export function randomId() {
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Create a RTC peer connection and:
 * - add this connection to `allPeerConnections`
 * - add the local stream as outgoing tracks to the peer connection
 *   so the local stream can be sent to the peer
 * - conversely, bind incoming tracks to remoteVideoNode.srcObject,
 *   so we can see the peer's stream
 * - forward ICE candidates to the peer through the socket. This is
 *   required by the RTC protocol to make both clients agree on what
 *   video/audio format and quality to use.
 *
 * @param {string} peerSocketId
 * @param {MediaStream} localStream
 * @param {HTMLVideoElement} remoteVideoNode
 * @param {SocketIOClient.Socket} socket
 * @param {Map<string, RTCPeerConnection>} allPeerConnections
 * @returns {RTCPeerConnection} */
export function createAndSetupPeerConnection(
  peerSocketId,
  localStream,
  remoteVideoNode,
  socket,
  allPeerConnections
) {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
    ],
  });
  allPeerConnections.set(peerSocketId, peerConnection);

  localStream
    .getTracks()
    .forEach((track) => peerConnection.addTrack(track, localStream));

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", peerSocketId, event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    remoteVideoNode.srcObject = event.streams[0];
  };

  return peerConnection;
}
