import { useCycle } from "framer-motion";
import styles from "./index.module.scss";
import Link from "next/link";
import { MenuButton } from "./MenuIcon";
import Sidebar from "./Sidebar";
import Image from "next/image";

const HeaderComponent = () => {
  const [isMenuOpen, cycleMenuOpen] = useCycle(false, true);

  return (
    <header className={styles.header}>
      <Sidebar isMenuOpen={isMenuOpen} toggleOpen={cycleMenuOpen} />

      {/* Left */}
      <div className={styles.left}>
        {/* LogoMark */}
        <Link href="/" passHref>
          <a className={styles.logoMark}>
            <Image
              src="/assets/logo-mark.svg"
              alt="Logo Mark"
              width={36}
              height={36}
            />
          </a>
        </Link>

        {/* Menu */}
        <div role="button" className={styles.menu}>
          <MenuButton
            isOpen={isMenuOpen}
            onClick={cycleMenuOpen}
            strokeWidth="2"
            color="white"
            lineProps={{ strokeLinecap: "round" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            width="36"
            height="36"
          />
        </div>
      </div>

      {/* Middle */}
      <div className={styles.middle}>
        {/* full Logo */}
        <Link href="/" passHref>
          <a className={styles.logo}>
            <Image src="/assets/logo.svg" alt="Logo" height={50} width={120} />
          </a>
        </Link>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {/* CTA */}
        <Link href="/chat" passHref>
          <a className={["btn primary", styles.btn].join(" ")}>Start Chat</a>
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;
