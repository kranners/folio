import { motion, useAnimate } from "motion/react";
import { useState } from "react";

import { CardFace, CARD_SIZE } from "./card-face.jsx";

const CARD_OFFSET = 8;
const CARD_OFFSET_DECAY = 0.8;

// Past this depth cards sit flat against each other and fade out, so a deep
// deck doesn't read as a smear of overlapping borders.
const MAX_VISIBLE_DEPTH = 4;

// Each card sits a little closer to the one in front of it than the last, so
// the stack tapers off instead of fanning out forever.
export const getCardOffset = (index) => {
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

const DeckCard = ({ company, index, depth, onSwipe }) => {
  const isFirstCard = index === 0;
  const pointerEventsClassName = isFirstCard ? "" : "pointer-events-none";

  return (
    <motion.li
      className={
        "row-start-1 row-end-1 col-start-1 col-end-1 " + pointerEventsClassName
      }
      initial={getCardStateAtIndex(index)}
      whileHover={{
        scale: 1.1,
      }}
      whileDrag={{
        scale: 1.1,
      }}
      onDragEnd={onSwipe}
      drag={isFirstCard}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.3}
      transition={{
        type: "spring",
      }}
      style={{
        zIndex: depth - index,
      }}
    >
      <CardFace logo={company.logo} name={company.name} role={company.role} />
    </motion.li>
  );
};

const Deck = ({ companies: initialCompanies, onRotate }) => {
  const [scope, animate] = useAnimate();
  const [companies, setCompanies] = useState(initialCompanies);

  const animateCompanies = () => {
    // The front card goes to the back, everything else moves forward one place.
    animate("li:nth-child(1)", getCardStateAtIndex(companies.length - 1));

    companies.slice(1).forEach((_, position) => {
      animate(`li:nth-child(${position + 2})`, getCardStateAtIndex(position));
    });
  };

  const rotateCompanies = () => {
    animateCompanies();

    const rotated = [...companies];
    rotated.push(rotated.shift());

    setCompanies(rotated);
    onRotate(rotated);
  };

  return (
    <motion.ul
      ref={scope}
      className={CARD_SIZE + " grid grid-rows-1 grid-cols-1"}
    >
      {companies.map((company, index) => (
        <DeckCard
          key={company.url}
          company={company}
          index={index}
          depth={companies.length}
          onSwipe={rotateCompanies}
        />
      ))}
    </motion.ul>
  );
};

export default Deck;
