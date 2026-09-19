import { motion } from "motion/react";

import Styles from "./styles.module.css";

const FADE = { duration: 0.4 };

const OnboardingHint = ({ isVisible, children }) => {
  return (
    <motion.p
      className={Styles.hint}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={FADE}
    >
      {children}
    </motion.p>
  );
};

export default OnboardingHint;
