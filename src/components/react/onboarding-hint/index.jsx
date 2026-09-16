import { motion } from "motion/react";

const HINT_CLASS_NAME =
  "select-none pointer-events-none lowercase whitespace-nowrap " +
  "text-lg md:text-xl font-semibold text-[#011c53]";

const FADE = { duration: 0.4 };

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
