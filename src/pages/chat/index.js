import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Layout from "../../components/Layout";
import styles from "./index.module.scss";
import Ripples from "../../components/Ripples";

// Socket imports
import Recorder from "opus-recorder";
import initRoom from "../../lib/client-socket/initRoom";
import setupRealtimeTranscript from "../../lib/client-socket/setupRealtimeTranscript";

const ChatPage = ({ data }) => {
  let socketRef = useRef(null);
  let recorderRef = useRef(null);

  const [liveTranscript, setLiveTranscript] = useState("");
  const [canOpenMic, setCanOpenMic] = useState(false);
  const [permittedOpenMic, setPermittedOpenMic] = useState(false);
  const [textBox, setTextBox] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    // Connect to socket
    const handleWsConnection = async () => {
      await fetch("/api/socketio");
      console.log("Api socket fetched");

      // Set socket ref to fetched ref
      socketRef.current = io.connect({
        path: "/api/socketio",
        transports: ["websocket"],
      });
      const socket = socketRef.current;

      // Setup connection
      socket.on("connect", () => {
        console.log("Connected");

        // Set socket connected state
        setIsSocketConnected(true);

        // Perform setup tasks
        initRoom(socket);
        setupRealtimeTranscript({
          socket,
          setLiveTranscript,
          recorder: recorderRef.current,
        });
      });

      // Setup disconnection
      socket.on("disconnect", () => {
        console.warn("Warning: Web Socket disconnect");
        setIsSocketConnected(false);
      });

      // Get the microphone stream
      try {
        setLocalStream(
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
        );
      } catch {
        // Throw error if access not granted
        alert(
          "No microphone found. Please activate your microphone and refresh the page."
        );
        return;
      }
    };

    const createRecorder = () => {
      const sampleRate = 16000;

      // Configure the recorder. The "Recorder" value is loaded in `index.html`
      // with the <script src="/js/recorder.min.js"> tag.
      const recorder = new Recorder({
        leaveStreamOpen: true,
        numberOfChannels: 1,

        // OPUS options
        encoderSampleRate: sampleRate,
        streamPages: true,
        maxBuffersPerPage: 1,
      });

      recorderRef.current = recorder;
    };

    if (!isSocketConnected) {
      createRecorder();
      handleWsConnection();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted", socket.current.emit);
    socket.current.emit("join", "asdca");
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        {/* Spiderman Image */}
        <div className={["spiderman", styles.spiderman].join(" ")}></div>
        {/* Spiderman - headings */}
        <div className={styles.contentWrapper}>
          <div className={styles.contentBox}>
            {/* Speaking Reactive animation */}
            <Ripples />

            {/* Content */}
            <div className={styles.content}>
              {isSocketConnected ? "Connected" : "Not-Conneted"}
              {data.map(({ speaker, line }, i) => (
                <div
                  key={i}
                  className={
                    (styles.convo,
                    { you: styles.right, spidy: styles.left }[speaker])
                  }
                >
                  <h3>{speaker}</h3>
                  <p>{line}</p>
                  <p>{liveTranscript}</p>
                </div>
              ))}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={textBox}
                  onChange={(e) => setTextBox(e.target.value)}
                />
              </form>
              <button onClick={() => setPermittedOpenMic(true)}></button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const dummyData = [
  {
    speaker: "you",
    line: "Hey, Is it just me or is it you",
  },
  { speaker: "spidy", line: "It's just me!" },
];

export const getServerSideProps = async () => {
  return {
    props: {
      data: dummyData,
    },
  };
};

export default ChatPage;
