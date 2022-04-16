import Head from "next/head";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.scss";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Spity Sense: Talk with Spider-Man</title>
        <meta
          name="description"
          content="Have you ever wanted to talk to spider-man, ever wanted to know how he feels after all this? Well, you now can... Audio Simulation Powered by GPT-3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className={styles.wrapper}>
          {/* Spiderman Image */}
          <div
            className="spiderman"
            layoutId="spiderman"
          ></div>
          {/* Spiderman - headings */}
          <div className={styles.content}>
            <h1 className={styles.heroText}>Spider-Man</h1>
            {/* CTA */}
            <Link href="/chat" passHref>
              <a className={styles.link}>
                {/* Play Icon */}
                <Image
                  src="/assets/play.svg"
                  width="70"
                  height="70"
                  alt="Start Chat"
                />

                {/* Text */}
                <span>Start chatting</span>
              </a>
            </Link>
          </div>
        </div>
      </Layout>
    </div>
  );
}
