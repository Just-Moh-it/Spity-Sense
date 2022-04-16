import styles from "./index.module.scss";
import Lottie from "react-lottie";
import RipplesLottie from "./ripples-lottie.json";

const Ripples = () => {
  const defaultOptions = {
    animationData: RipplesLottie,
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.lottieWrapper}>
        <div className={styles.lottieWrapperChildren}>
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      </div>
    </div>
  );
};

export default Ripples;
