import styles from "./index.module.scss";
import Lottie from "react-lottie";
import RipplesLottie from "./ripples-lottie.json";

const Ripples = () => {
  const defaultOptions = {
    animationData: RipplesLottie,
  };
  return (
    <>
      <Lottie options={defaultOptions} height={400} width={400} />
    </>
  );
};

export default Ripples;
