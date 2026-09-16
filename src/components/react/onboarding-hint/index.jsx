import { motion } from "motion/react";

// One look for every nudge on the page, so they read as the same voice rather
// than as labels belonging to whatever they sit next to. A hint is something to
// read, not something to hit.
const HINT_CLASS_NAME =
  "select-none pointer-events-none lowercase whitespace-nowrap " +
  "text-lg md:text-xl font-semibold text-[#011c53]";

const FADE = { duration: 0.4 };

// Driven by a prop instead of unmounting, so the leaving fade gets to play.
const OnboardingHint = ({ isVisible, className = "", children }) => {
  return (
    <motion.p
      className={HINT_CLASS_NAME + " " + className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={FADE}
    >
      {children}
    </motion.p>
  );
};

export default OnboardingHint;
