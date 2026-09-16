import { motion, useAnimate } from "motion/react";
import { useState } from "react";

import CardFace, { CARD_SIZE } from "./card-face.jsx";

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

const DeckCard = ({ logo, index, depth, onSwipe }) => {
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
      <CardFace
        source={logo.source}
        description={logo.description}
        role={logo.role}
      />
    </motion.li>
  );
};

const Deck = ({ logos: initialLogos, ref, onRotate }) => {
  const [scope, animate] = useAnimate();
  const [logos, setLogos] = useState(initialLogos);

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

    // The stack rotates in here, so whoever owns the deck has to be told what
    // is on top now.
    if (onRotate) {
      onRotate(newLogos);
    }
  };

  // The hand needs to know where the stack sat so it can deal cards out of it.
  const attachRef = (element) => {
    scope.current = element;

    if (ref) {
      ref.current = element;
    }
  };

  return (
    <motion.ul
      ref={attachRef}
      className={CARD_SIZE + " grid grid-rows-1 grid-cols-1"}
    >
      {logos.map((logo, index) => (
        <DeckCard
          key={logo.url}
          logo={logo}
          index={index}
          depth={logos.length}
          onSwipe={rotateLogos}
        />
      ))}
    </motion.ul>
  );
};

export default Deck;
