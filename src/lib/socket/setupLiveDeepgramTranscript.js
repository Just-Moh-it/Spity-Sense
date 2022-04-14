const { Deepgram } = require("@deepgram/sdk");
const DG_KEY = process?.env?.DG_KEY;
const WebSocket = require("ws");
import Transcript from "../client-socket/Transcript";

export default function setupRealtimeTranscription({ socket, room }) {
  /** The sampleRate must match what the client uses. */
  const sampleRate = 16000;

  const deepgram = new Deepgram(DG_KEY);

  const dgSocket = deepgram.transcription.live({
    punctuate: true,
  });

  /** We must receive the very first audio packet from the client because
   * it contains some header data needed for audio decoding.
   *
   * Thus, we send a message to the client when the socket to Deepgram is ready,
   * so the client knows it can start sending audio data.
   */
  dgSocket.addListener("open", () => socket.emit("can-open-mic"));

  /**
   * We forward the audio stream from the client's microphone to Deepgram's server.
   */
  socket.on("microphone-stream", (stream) => {
    if (dgSocket.getReadyState() === WebSocket.OPEN) {
      dgSocket.send(stream);
    }
  });

  /** On Deepgram's server message, we forward the response back to all the
   * clients in the room.
   */
  dgSocket.addListener("transcriptReceived", (transcription) => {
    socket.emit("transcript-result", transcription);
  });

  /** We close the dsSocket when the client disconnects. */
  socket.on("disconnect", () => {
    if (dgSocket.getReadyState() === WebSocket.OPEN) {
      dgSocket.finish();
    }
  });
}
