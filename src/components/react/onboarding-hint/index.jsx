import { motion } from "motion/react";

// One look for every nudge on the page, so they read as the same voice rather
// than as labels belonging to whatever they happen to be sitting next to.
// Never in the way: a hint is something to read, not something to hit.
const HINT_CLASS_NAME =
  "select-none pointer-events-none lowercase whitespace-nowrap " +
  "text-lg md:text-xl font-semibold text-[#011c53]";

const FADE = { duration: 0.4 };

// Hints fade in rather than appearing, and fade out for good once the thing
// they were asking for has happened. Driven by a prop instead of unmounting so
// the leaving fade actually gets to play.
const OnboardingHint = ({ isVisible, className = "", children }) => {
  return (
    <motion.p
      aria-hidden
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
