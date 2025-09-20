import { motion } from "motion/react";

const HEIGHT = 36;

const Y_OFFSET_KEYFRAMES = [
  -0,
  -1 * HEIGHT,
  -2 * HEIGHT,
  -3 * HEIGHT,
  -4 * HEIGHT,
  -5 * HEIGHT,
  -6 * HEIGHT,
  -7 * HEIGHT,
  -8 * HEIGHT,
  -9 * HEIGHT,
  -10 * HEIGHT,
  -11 * HEIGHT,
  -12 * HEIGHT,
];

const Roles = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-3xl font-bold flex flex-row items-center gap-3 whitespace-nowrap overflow-hidden">
        <span className="color-[#011c53]">im a</span>
        <motion.ul
          animate={{
            y: Y_OFFSET_KEYFRAMES,
          }}
          transition={{
            type: "keyframes",
            repeat: Infinity,
            duration: 10,
          }}
          className="flex flex-col items-left h-10"
        >
          <li className="text-[#666666]">Software Developer</li>
          <li className="text-[#4285f4]">Computer Scientist</li>
          <li className="text-[#ea4335]">Part-time Ninja</li>
          <li className="text-[#debff4]">Vim Evangelist</li>
          <li className="text-[#34a853]">Nix Obsessive</li>
          <li className="text-[#fbbc04]">Full-stack Wizard</li>
          <li className="text-[#c7828b]">Caffeine Enthusiast</li>
          <li className="text-[#84a4f9]">TypeScript Gymnast</li>
          <li className="text-[#fcbeb1]">Slack Fiend</li>
          <li className="text-[#d480aa]">Rampant Automator</li>
          <li className="text-[#e69cff]">Prolific Emoji User</li>
          <li className="text-[#afe0ce]">Note Author</li>
          <li className="text-[#666666]">Software Developer</li>
        </motion.ul>
      </div>
    </div>
  );
};

export default Roles;
