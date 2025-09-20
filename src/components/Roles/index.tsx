import { motion } from "motion/react";

const Roles = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-4xl font-bold flex flex-row items-center gap-3">
        <span className="color-[#011c53]">i'm a</span>
        <motion.ul className="flex flex-col items-left h-10 whitespace-nowrap overflow-hidden">
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
