import styles from "./index.module.scss";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { name: "Home", to: "/", id: 1 },
  { name: "Open Chat", to: "/chat", id: 2 },
  {
    name: "About",
    to: "https://dev.to/just_moh_it/introducing-spitey-sense-simulate-conversations-with-spider-man-using-gpt-3-and-deepgram-4d0j",
    id: 3,
  },
  { name: "GitHub", to: "https://github.com/Just-Moh-it/Spity-Sense", id: 4 },
];

const itemVariants = {
  closed: {
    opacity: 0,
  },
  open: { opacity: 1 },
};

const sideVariants = {
  closed: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.2,
      staggerDirection: 1,
    },
  },
};

const Sidebar = ({ isMenuOpen: open, toggleOpen }) => {
  return (
    <div className={styles.wrapper}>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{
              width: 300,
            }}
            exit={{
              width: 0,
              transition: { delay: 0.7, duration: 0.3 },
            }}
          >
            {/* Close Icon */}
            <button
              className={[styles.closeBtn, "btn secondary"].join(" ")}
              onClick={toggleOpen}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </motion.svg>
            </button>

            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideVariants}
              className={styles.links}
            >
              {links.map(({ name, to, id }) => (
                <motion.a
                  key={id}
                  href={to}
                  whileHover={{ scale: 1.1 }}
                  variants={itemVariants}
                >
                  {name}
                </motion.a>
              ))}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
