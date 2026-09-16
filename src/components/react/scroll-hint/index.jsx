import { useEffect, useRef, useState } from "react";

import OnboardingHint from "../onboarding-hint/index.jsx";

// Half a frame along is far enough that the nudge has clearly been taken.
const FADE_AT_PROGRESS = 0.5;

// A nudge to keep scrolling. It finds the frame it was dropped into rather than
// being told, so it can be dropped into any of them.
const ScrollHint = ({ className = "", text }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Nothing brings the hint back, so once it is gone there is nothing left
    // to listen for.
    if (!isVisible) {
      return;
    }

    const frame = ref.current.closest(".snap-start");
    const container = frame.parentElement;

    const onScroll = () => {
      const scrolled =
        container.getBoundingClientRect().top -
        frame.getBoundingClientRect().top;

      if (scrolled / frame.offsetHeight >= FADE_AT_PROGRESS) {
        setIsVisible(false);
      }
    };

    // A reload can land part way down the page, where the hint has already
    // been earned and never gets a scroll event to say so.
    onScroll();

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
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
