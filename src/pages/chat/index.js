import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Layout from "../../components/Layout";
import styles from "./index.module.scss";
import Ripples from "../../components/Ripples";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Socket imports
import Recorder from "opus-recorder";
import initRoom from "../../lib/client-socket/initRoom";
import setupRealtimeTranscript from "../../lib/client-socket/setupRealtimeTranscript";

const ChatPage = ({ data }) => {
  let socketRef = useRef(null);
  let recorderRef = useRef(null);
  let messageEndRef = useRef(null);
  const [
    getCompletion,
    {
      error: getCompletionError,
      data: getCompletionData,
      loading: getCompletionLoading,
    },
  ] = useCallApi();

  const [liveTranscript, setLiveTranscript] = useState("");
  const [_, setLocalStream] = useState(null);
  const [messages, setMessages] = useState([]);
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
          addMessage,
        });
      });

      // Setup disconnection
      socket.on("disconnect", () => {
        console.warn("Warning: The Web Socket was disconnect");
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
  }, [isSocketConnected]);

  useEffect(() => {
    // If finally loaded data, add to to the chat widget
    if (
      getCompletionLoading === false &&
      !getCompletionError &&
      getCompletionData.completion
    ) {
      addMessage({
        type: "completion",
        line: [getCompletionData.completion],
      });
    }
  }, [getCompletionData, getCompletionLoading, getCompletionError]);

  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add a message to the chat widget
  const addMessage = ({ type, line }) => {
    setMessages((messages) => {
      if (type === "prompt") {
        // Check if the last message line was the exact same as the first one
        if (
          !(line && line.trim("")) ||
          (messages &&
            (messages.slice(-1)[0]?.line === line ||
              messages.slice(-2)[0]?.line === line ||
              messages.slice(-3)[0]?.line === line))
        ) {
          return messages;
        }

        // Request for API Response
        getCompletion({
          incompletePrompt: line,
          pastConversations: messages,
        });
      }

      return [...messages, { type, line }];
    });
  };

  return (
    <Layout>
      <div className={styles.wrapper}>
        {/* Spiderman Image */}
        <div
          className={["spiderman", styles.spiderman].join(" ")}
          layoutId="spiderman"
        ></div>
        {/* Spiderman - headings */}
        <div className={styles.contentWrapper}>
          <motion.div
            className={styles.contentBox}
            // Enter in animations
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Absolutely positioned ripple animation */}
            <Ripples />

            {/* Top bar */}
            <div className={styles.headerText}>
              Peter:{" "}
              <span className="bold">
                {isSocketConnected ? "Online" : "Offline"}
              </span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              {messages.length > 0 ? (
                messages?.map(({ type, line }, i) => (
                  <motion.div
                    key={i}
                    className={
                      (styles.convo,
                      { prompt: styles.right, completion: styles.left }[type])
                    }
                    onLoad={(e) => e.scrollIntoView()}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3>{{ prompt: "You", completion: "Spidey" }[type]}</h3>
                    <p>{line}</p>
                    <p>{liveTranscript}</p>
                  </motion.div>
                ))
              ) : (
                <div className={styles.welcomeWidget}>
                  {/* Icon */}
                  <div className={styles.image}>
                    <Image
                      src={"/assets/mic.svg"}
                      alt="Microphone"
                      layout="fill"
                    />
                  </div>
                  <h1>Spidy is listening</h1>
                  <p>Start speaking bud...</p>
                </div>
              )}
              <div ref={messageEndRef}></div>
            </div>
            {/* Loading indicator */}
            <div className={styles.isLoading}>
              <AnimatePresence>
                {getCompletionLoading === true && (
                  <motion.div
                    // Add enter in from bottom animation
                    animate={{ y: 0, opacity: 1 }}
                    initial={{ y: 20, opacity: 0 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.animatedDiv}
                  >
                    Spidy is thinking...
                  </motion.div>
                )}
              </AnimatePresence>
              {getCompletionError?.message}
            </div>

            {/* Bottom Bar */}
            <div className={styles.statusText}>
              Stark network:{" "}
              <span className="bold">
                {isSocketConnected ? "Up & Connected" : "Offline"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

const useCallApi = () => {
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState({ completion: "" });
  const [error, setError] = useState(null);

  const callAPI = async ({ incompletePrompt, pastConversations }) => {
    // Call the API
    setLoading(true);

    try {
      // Check if prompt is empty
      if (!incompletePrompt.trim()) {
        return setLoading(false);
        // return setData("");
      }

      const dataToPost = JSON.stringify({
        incompletePrompt: incompletePrompt.trim(),
        pastConversations,
      });

      const res = await fetch("/api/ai/getCompletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataToPost,
      });

      const jsonRes = await res.json();

      setData({ completion: jsonRes.completion });
      return setLoading(false);
    } catch (err) {
      return setError(err);
    }
  };

  return [callAPI, { loading, error, data }];
};

export default ChatPage;
