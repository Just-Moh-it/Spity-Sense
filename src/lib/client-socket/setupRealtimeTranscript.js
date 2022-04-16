import Transcript from "./Transcript";

function setupRealtimeTranscript({ socket, recorder, addMessage }) {
  socket.on("can-open-mic", () => {
    recorder.start();
  });

  recorder.ondataavailable = (e) => {
    socket.emit("microphone-stream", e.buffer);
  };

  const transcript = new Transcript();

  socket.on("transcript-result", (jsonFromServer) => {
    transcript.addServerAnswer(jsonFromServer);

    addMessage({
      type: "prompt",
      line: transcript.getString().join(" ").trim(),
    });
  });
}

export default setupRealtimeTranscript;
