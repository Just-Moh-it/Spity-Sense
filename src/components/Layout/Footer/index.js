import styles from "./index.module.scss";
import Link from "next/link";

const FooterComponent = () => {
  return (
    <footer className={styles.footer}>
      {/* Left */}
      <div className={styles.left}>
        {/* Copy right text */}
        <Link href="https://github.com/Just-Moh-it" passHref>
          <a className={styles.footerLink}>Made with &lt;3 by Mohit</a>
        </Link>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {/* Copy right text */}Design:{" "}
        <Link href="https://dribbble.com/phamduyminh" passHref>
          <a className={styles.footerLink}>Minh Pham</a>
        </Link>
      </div>
    </footer>
  );
};

export default FooterComponent;
