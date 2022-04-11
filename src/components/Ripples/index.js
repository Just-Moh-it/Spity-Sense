import styles from "./index.module.scss";
import AudioSpectrum from "react-audio-spectrum";

// const Ripples = () => {
//   return (
//     <div className={styles.wrapper}>
//       <div class={styles.hover}></div>
//       <div className={styles.art}>
//         {[...Array(6)].map((_, i) => {
//           return <div class={styles.drop}></div>;
//         })}
//       </div>
//     </div>
//   );
// };

const Ripples = () => {
  return (
    <>
      <audio
        id="audio-element"
        src="https://samplelib.com/lib/preview/mp3/sample-12s.mp3"
        autoPlay
        muted
      ></audio>
      <AudioSpectrum
        id="audio-canvas"
        height={200}
        width={300}
        audioId={"audio-element"}
        capColor={"red"}
        capHeight={2}
        meterWidth={2}
        meterCount={512}
        meterColor={[
          { stop: 0, color: "#f00" },
          { stop: 0.5, color: "#0CD7FD" },
          { stop: 1, color: "red" },
        ]}
        gap={4}
      />
    </>
  );
};

export default Ripples;
