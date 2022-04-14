import Transcript from "./Transcript";

function setupRealtimeTranscript({
  socket,
  setLiveTranscript,
  recorder,
}) {
  socket.on("can-open-mic", () => {
    console.log("Mic Opened");
    recorder.start();
  });

  recorder.ondataavailable = (e) => {
    socket.emit("microphone-stream", e.buffer);
    console.log("Mic Opened");
  };

  const transcript = new Transcript();

  socket.on("transcript-result", (jsonFromServer) => {
    transcript.addServerAnswer(jsonFromServer);

    setLiveTranscript(transcript.getString());
  });
}

export default setupRealtimeTranscript;
