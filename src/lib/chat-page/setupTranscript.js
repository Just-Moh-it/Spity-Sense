export default function setupRealtimeTranscription(
  socket,
  localTranscriptNode,
  remoteTranscriptNode
) {
  const sampleRate = 16000;

  // Configure the recorder. The "Recorder" value is loaded in `index.html`
  // with the <script src="/js/recorder.min.js"> tag.
  const recorder = new Recorder({
    encoderPath: "/js/encoderWorker.min.js",
    leaveStreamOpen: true,
    numberOfChannels: 1,

    // OPUS options
    encoderSampleRate: sampleRate,
    streamPages: true,
    maxBuffersPerPage: 1,
  });

  /** We must forward the very first audio packet from the client because
   * it contains some header data needed for audio decoding.
   *
   * Thus, we must wait for the server to be ready before we start recording.
   */
  socket.on("can-open-mic", () => {
    recorder.start();
  });

  /** We forward our audio stream to the server. */
  recorder.ondataavailable = (e) => {
    socket.emit("microphone-stream", e.buffer);
  };

  const localTranscript = new Transcript();
  const remoteTranscript = new Transcript();

  /** As Deepgram returns real-time transcripts, we display them back in the DOM.
   * @param {string} socketId
   * @param {any} jsonFromServer
   */
  socket.on("transcript-result", (socketId, jsonFromServer) => {
    if (socketId === socket.id) {
      localTranscript.addServerAnswer(jsonFromServer);

      localTranscriptNode.innerHTML = "";
      localTranscriptNode.appendChild(localTranscript.toHtml());
    } else {
      remoteTranscript.addServerAnswer(jsonFromServer);

      remoteTranscriptNode.innerHTML = "";
      remoteTranscriptNode.appendChild(remoteTranscript.toHtml());
    }
  });
}
