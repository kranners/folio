import { motion, useAnimate } from "motion/react";

import FutureGridLogo from "./logos/future-grid.png";
import LivePresoLogo from "./logos/livepreso.png";
import InlightLogo from "./logos/inlight.jpg";
import SeidoKarateLogo from "./logos/seido-karate.png";
import SwinburneLogo from "./logos/swinburne.png";
import { useState } from "react";

const LOGOS = [
  {
    source: FutureGridLogo,
    description: "Future Grid",
    role: "devops engineer",
    url: "https://future-grid.com/",
  },
  {
    source: LivePresoLogo,
    description: "LivePreso",
    role: "full stack engineer",
    url: "https://www.livepreso.com/",
  },
  {
    source: InlightLogo,
    description: "Inlight",
    role: "senior engineer",
    url: "https://www.inlight.com.au/",
  },
  {
    source: SeidoKarateLogo,
    description: "Seido Karate",
    role: "admin and volunteer",
    url: "https://www.seidomelbourne.com.au/",
  },
  {
    source: SwinburneLogo,
    description: "Swinburne",
    role: "bachelor of comp. sci",
    url: "https://www.swinburne.edu.au/",
  },
  // {
  //   source: FutureGridLogo,
  //   description: "foo corp",
  //   role: "foo engineer",
  //   url: "https://example.com/foo",
  // },
  // {
  //   source: LivePresoLogo,
  //   description: "bar industries",
  //   role: "bar wrangler",
  //   url: "https://example.com/bar",
  // },
  // {
  //   source: InlightLogo,
  //   description: "baz labs",
  //   role: "baz technician",
  //   url: "https://example.com/baz",
  // },
  // {
  //   source: SeidoKarateLogo,
  //   description: "qux group",
  //   role: "qux specialist",
  //   url: "https://example.com/qux",
  // },
  // {
  //   source: SwinburneLogo,
  //   description: "quux holdings",
  //   role: "quux analyst",
  //   url: "https://example.com/quux",
  // },
  // {
  //   source: FutureGridLogo,
  //   description: "corge co",
  //   role: "corge operator",
  //   url: "https://example.com/corge",
  // },
];

const CARD_OFFSET = 8;
const CARD_OFFSET_DECAY = 0.8;

// Past this depth cards sit flat against each other and fade out, so a deep
// deck doesn't read as a smear of overlapping borders.
const MAX_VISIBLE_DEPTH = 4;

// Each card sits a little closer to the one in front of it than the last, so
// the stack tapers off instead of fanning out forever.
const getCardOffset = (index) => {
  const depth = Math.min(index, MAX_VISIBLE_DEPTH);
  return (
    (CARD_OFFSET * (1 - CARD_OFFSET_DECAY ** depth)) / (1 - CARD_OFFSET_DECAY)
  );
};

const getCardStateAtIndex = (index) => ({
  x: getCardOffset(index),
  y: getCardOffset(index),
  rotate: 0,
  scale: 1,
  opacity: index > MAX_VISIBLE_DEPTH ? 0 : 1,
  z: index,
});

const CompanyCard = ({ source, description, role, index, onSwipe }) => {
  const isFirstCard = index === 0;
  const pointerEventsClassName = isFirstCard ? "" : "pointer-events-none";

  return (
    <motion.li
      className={
        "border-2 rounded-2xl p-5 row-start-1 row-end-1 col-start-1 col-end-1 bg-white shadow-xl " +
        pointerEventsClassName
      }
      initial={getCardStateAtIndex(index)}
      whileHover={{
        scale: 1.1,
      }}
      whileDrag={{
        scale: 1.1,
      }}
      onDragEnd={onSwipe}
      drag={index === 0}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.3}
      transition={{
        type: "spring",
      }}
      style={{
        zIndex: LOGOS.length - index,
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 md:gap-5">
        <img
          src={source.src}
          alt={description}
          className="pointer-events-none p-2 max-w-1/2"
        />

        <p className="lowercase text-xl md:text-2xl font-semibold">
          {description}
        </p>
        <p className="lowercase text-base md:text-xl font-light">{role}</p>
      </div>
    </motion.li>
  );
};

const Companies = () => {
  const [scope, animate] = useAnimate();
  const [logos, setLogos] = useState(LOGOS);

  const animateLogos = () => {
    // The front card goes to the back, everything else moves forward one place.
    animate("li:nth-child(1)", getCardStateAtIndex(logos.length - 1));

    logos.slice(1).forEach((_, position) => {
      animate(`li:nth-child(${position + 2})`, getCardStateAtIndex(position));
    });
  };

  const rotateLogos = () => {
    animateLogos();

    const newLogos = [...logos];
    newLogos.push(newLogos.shift());
    setLogos(newLogos);
  };

  return (
    <div className="w-screen h-dvh pt-[calc(20vh+7rem)] overflow-visible flex flex-col items-center justify-center">
      <h2 className="text-[#4a230f] mb-8 text-xl">have a little peruse...</h2>
      <motion.ul
        ref={scope}
        className="h-1/3 w-1/4 md:h-2/3 md:w-1/3 lg:h-2/3 lg:w-1/4 max-h-94 max-w-68 min-h-68 min-w-52 grid grid-rows-1 grid-cols-1"
      >
        {logos.map((logo, index) => (
          <CompanyCard
            key={logo.url}
            source={logo.source}
            description={logo.description}
            role={logo.role}
            index={index}
            onSwipe={rotateLogos}
          />
        ))}
      </motion.ul>
    </div>
  );
};

export default Companies;
