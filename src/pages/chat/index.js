import Layout from "../../components/Layout";
import styles from "./index.module.scss";
import Ripples from "../../components/Ripples";

const ChatPage = ({ data }) => {
  return (
    <Layout>
      <div className={styles.wrapper}>
        {/* Spiderman Image */}
        <div className={["spiderman", styles.spiderman].join(" ")}></div>
        {/* Spiderman - headings */}
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            {/* Speaking Reactive animation */}
            <Ripples />

            {/* Content */}
            {data.map((item) => (
              <div
                className={
                  (styles.convo,
                  { you: styles.right, spidy: styles.left }[item.speaker])
                }
              >
                <h3>{item.speaker}</h3>
                <p>{item.line}</p>
              </div>
            ))}
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
