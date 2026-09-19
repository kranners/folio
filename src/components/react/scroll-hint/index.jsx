import { useEffect, useRef, useState } from "react";

import OnboardingHint from "../onboarding-hint/index.jsx";

import Styles from "./styles.module.css";

const FADE_AT_PROGRESS = 0.5;

const ScrollHint = ({ text }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const frame = ref.current.closest("[data-section]");
    const container = frame.parentElement;

    const hideOnceScrolledPast = () => {
      const scrolled =
        container.getBoundingClientRect().top -
        frame.getBoundingClientRect().top;

      if (scrolled / frame.offsetHeight >= FADE_AT_PROGRESS) {
        setIsVisible(false);
      }
    };

    hideOnceScrolledPast();

    container.addEventListener("scroll", hideOnceScrolledPast, {
      passive: true,
    });
    return () => container.removeEventListener("scroll", hideOnceScrolledPast);
  }, [isVisible]);

  return (
    <div ref={ref} className={Styles.hint}>
      <OnboardingHint isVisible={isVisible}>{text}</OnboardingHint>
    </div>
  );
};

export default ScrollHint;
