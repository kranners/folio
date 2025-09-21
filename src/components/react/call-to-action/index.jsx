import { motion, stagger } from "motion/react";
import Styles from "./styles.module.scss";

import LinkedinIcon from "./socials/linkedin.svg";
import GitHubIcon from "./socials/github.svg";

const MAGIC_WORD = Array.from("let's make ✨ magic ✨ happen.");

export default function CallToAction() {
  const WORD_CHARACTERS = MAGIC_WORD.map((character, index) => {
    return (
      <motion.p
        key={`character-${index}`}
        animate={{
          y: ["0%", "-20%"],
          scale: [0.9, 1.1],
          rotate: [0, (Math.random() * 10 - Math.random() * 10)],
          color: ["#666", "#888"],
        }}
        transition={{
          type: "spring",
          ease: ["easeOut", "easeIn"],
          repeat: Infinity,
          repeatType: "mirror",
          duration: 0.8,
          delay: 0.1 * index,
        }}
      >
        {character}
      </motion.p>
    )
  });

  return (
    <div className={Styles.container}>
      <motion.h1
        className={Styles.title}
        transition={{
          delayChildren: stagger(0.3),
        }}
      >
        {WORD_CHARACTERS}
      </motion.h1>

      <p className={Styles.paragraph}>
        <span>contact me at</span>
        <a href="mailto:aaron@cute.engineer">aaron@cute.engineer</a>
      </p>
      <p className={Styles.paragraph}>
        <a href="https://www.linkedin.com/in/aajrp/">
          <span>reach out on linkedin here</span>
        </a>
        <img className={Styles.icon} src={LinkedinIcon.src} alt="Linkedin Icon" />
      </p>
      <p className={Styles.paragraph}>
        <a href="https://github.com/kranners">
          click here if youre a nerd
        </a>
        <img className={Styles.icon} src={GitHubIcon.src} alt="GitHub Icon" />
      </p>
    </div>
  );
}
