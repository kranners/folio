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
    role: "learned stuff",
    url: "https://www.swinburne.edu.au/",
  },
];

const getCardStateAtIndex = (index) => ({
  rotate: index * 4,
  scale: 1,
  z: index,
});

const CompanyCard = ({ source, description, role, index, onSwipe }) => {
  const isFirstCard = index === 0;
  const pointerEventsClassName = isFirstCard ? "" : "pointer-events-none";

  return ( 
    <motion.li
      className={"border-4 rounded-3xl p-8 row-start-1 row-end-1 col-start-1 col-end-1 bg-white shadow-xl " + pointerEventsClassName}
      initial={getCardStateAtIndex(index)}
      whileHover={{
        scale: 1.1,
        rotate: 0,
      }}
      whileDrag={{
        scale: 1.1,
        rotate: 0,
      }}
      onDragEnd={onSwipe}
      drag={index === 0}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.3}
      transition={{
        type: "spring"
      }}
      style={{
        zIndex: LOGOS.length - index,
      }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center gap-2 md:gap-8">
        <img
          src={source.src}
          alt={description}
          className="pointer-events-none p-4 max-w-2/3"
        />

        <p className="lowercase text-xl md:text-4xl font-semibold">{description}</p>
        <p className="lowercase text-lg md:text-2xl font-light">{role}</p>
      </div>
    </motion.li>
  )
}

const Companies = () => {
  const [scope, animate] = useAnimate();
  const [logos, setLogos] = useState(LOGOS);

  const animateLogos = () => {
    logos.keys().forEach((index) => {
      animate(`li:nth-child(${index + 1})`, getCardStateAtIndex(index - 1));
    });

    animate("li:nth-child(1)", getCardStateAtIndex(logos.length))
  }

  const rotateLogos = () => {
    animateLogos();

    const newLogos = [...logos];
    newLogos.push(newLogos.shift());
    setLogos(newLogos);
  }

  return (
    <div className="w-screen h-screen pt-[35vh] overflow-visible flex flex-col items-center">
      <h2 className="text-[#4a230f] mb-12 text-2xl">have a little peruse...</h2>
      <motion.ul ref={scope} className="h-1/3 w-1/4 md:h-2/3 md:w-1/3 lg:h-4/5 lg:w-1/3 max-h-128 max-w-80 min-h-80 min-w-60 grid grid-rows-1 grid-cols-1">
        {logos.map((logo, index) => (
          <CompanyCard
            key={logo.url}
            source={logo.source}
            description={logo.description}
            url={logo.url}
            role={logo.role}
            index={index}
            onSwipe={rotateLogos}
          />
        ))}
      </motion.ul>
    </div>
  );
}

export default Companies;
