import { motion } from "motion/react";

const FADE = { duration: 0.4 };

const OnboardingHint = ({ isVisible, children }) => {
  return (
    <motion.p
      className="select-none pointer-events-none lowercase whitespace-nowrap text-lg md:text-xl font-semibold text-[#011c53]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={FADE}
    >
      {children}
    </motion.p>
  );
};

export default OnboardingHint;
