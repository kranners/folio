import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Styles from "./styles.module.scss";

import OnboardingHint from "../onboarding-hint/index.jsx";

import LinkedinIcon from "./socials/linkedin.svg";
import GitHubIcon from "./socials/github.svg";

const MAGIC_WORD = Array.from("let's make ✨ magic ✨ happen.");

// The last frame owns the page-level reveal latch, so it travels with this
// island if the frame is ever converted to another framework.
const REVEAL_THRESHOLD = 0.9;

export default function CallToAction() {
  const ref = useRef(null);
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    const frame = ref.current.closest(".snap-start");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        document.documentElement.dataset.frameworksRevealed = "";
        setIsHintVisible(true);
        observer.disconnect();
      },
      { threshold: REVEAL_THRESHOLD },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const WORD_CHARACTERS = MAGIC_WORD.map((character, index) => {
    return (
      <motion.p
        key={`character-${index}`}
        animate={{
          y: ["0%", "-20%"],
          scale: [0.9, 1.1],
          rotate: [0, Math.random() * 10 - Math.random() * 10],
          color: ["#666", "#888"],
        }}
        transition={{
          type: "spring",
          repeat: Infinity,
          repeatType: "mirror",
          duration: 0.8,
          delay: 0.1 * index,
        }}
      >
        {character}
      </motion.p>
    );
  });

  return (
    <>
      <div ref={ref} className={Styles.container}>
        <motion.h1 className={Styles.title}>{WORD_CHARACTERS}</motion.h1>

        <p className={Styles.paragraph}>
          <span>contact me at</span>
          <a href="mailto:aaron@cute.engineer">aaron@cute.engineer</a>
        </p>
        <p className={Styles.paragraph}>
          <a href="https://www.linkedin.com/in/aajrp/">
            <span>reach out on linkedin here</span>
          </a>
          <img
            className={Styles.icon}
            src={LinkedinIcon.src}
            alt="Linkedin Icon"
          />
        </p>
        <p className={Styles.paragraph}>
          <a href="https://github.com/kranners">click here if youre a nerd</a>
          <img className={Styles.icon} src={GitHubIcon.src} alt="GitHub Icon" />
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
        <OnboardingHint isVisible={isHintVisible}>
          now scroll back up 👆
        </OnboardingHint>
      </div>
    </>
  );
}
