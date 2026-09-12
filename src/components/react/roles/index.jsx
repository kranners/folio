import { motion } from "motion/react";

const HEIGHT_PX = 36;
const HOLD_FRACTION = 0.7;
const SECONDS_PER_ROLE = 1.5;

const ROLES = [
  { label: "Software Developer", color: "#666666" },
  { label: "Computer Scientist", color: "#4285f4" },
  { label: "Part-time Ninja", color: "#ea4335" },
  { label: "Robot Orchestrator", color: "#c7828b" },
  { label: "Vim Evangelist", color: "#debff4" },
  { label: "Nix Obsessive", color: "#34a853" },
  { label: "Full-stack Wizard", color: "#fbbc04" },
  { label: "Caffeine Enthusiast", color: "#c7828b" },
  { label: "TypeScript Gymnast", color: "#84a4f9" },
  { label: "Slack Fiend", color: "#fcbeb1" },
  { label: "Rampant Automator", color: "#d480aa" },
  { label: "Prolific Emoji User", color: "#e69cff" },
  { label: "Note Author", color: "#afe0ce" },
];

const Y_OFFSET_KEYFRAMES = [
  ...ROLES.flatMap((_, index) => [-index * HEIGHT_PX, -index * HEIGHT_PX]),
  -ROLES.length * HEIGHT_PX,
];

const TIMES = [
  ...ROLES.flatMap((_, index) => [
    index / ROLES.length,
    (index + HOLD_FRACTION) / ROLES.length,
  ]),
  1,
];

const Roles = () => {
  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="text-3xl font-bold flex flex-row items-center gap-3 whitespace-nowrap">
        <span className="text-[#011c53]">im a</span>
        <div className="h-9 overflow-hidden">
          <motion.ul
            animate={{ y: Y_OFFSET_KEYFRAMES }}
            transition={{
              times: TIMES,
              ease: "backOut",
              repeat: Infinity,
              duration: SECONDS_PER_ROLE * ROLES.length,
            }}
            className="flex flex-col items-start"
          >
            {ROLES.map(({ label, color }) => (
              <li key={label} className="leading-9" style={{ color }}>
                {label}
              </li>
            ))}
            <li
              aria-hidden
              className="leading-9"
              style={{ color: ROLES[0].color }}
            >
              {ROLES[0].label}
            </li>
          </motion.ul>
        </div>
      </div>
    </div>
  );
};

export default Roles;
