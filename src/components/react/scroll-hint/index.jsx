import { useEffect, useRef, useState } from "react";

import OnboardingHint from "../onboarding-hint/index.jsx";

const FADE_AT_PROGRESS = 0.5;

const ScrollHint = ({ className = "", text }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const frame = ref.current.closest(".snap-start");
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
    <div
      ref={ref}
      className={
        "pointer-events-none absolute inset-x-0 flex justify-center " +
        className
      }
    >
      <OnboardingHint isVisible={isVisible}>{text}</OnboardingHint>
    </div>
  );
};

export default ScrollHint;
