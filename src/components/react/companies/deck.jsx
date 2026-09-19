import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { CardFace } from "./card-face.jsx";

import Styles from "./styles.module.css";

const CARD_OFFSET = 8;
const CARD_OFFSET_DECAY = 0.8;

const MAX_VISIBLE_DEPTH = 4;

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

const CARD_SPRING = { type: "spring" };

const CARD_TRANSITION = {
  default: CARD_SPRING,
  opacity: { duration: 0.4, ease: "easeIn" },
};

const MIN_SWIPE_DISTANCE = 100;

const DeckCard = ({ company, index, depth, onSwipe }) => {
  const isFirstCard = index === 0;
  const face = (
    <CardFace logo={company.logo} name={company.name} role={company.role} />
  );

  const onDragEnd = (_event, { offset }) => {
    const thrownDistance = Math.hypot(offset.x, offset.y);

    if (thrownDistance >= MIN_SWIPE_DISTANCE) {
      onSwipe();
    }
  };

  const onActivate = (event) => {
    const isKeyboardActivation = event.detail === 0;

    if (isKeyboardActivation) {
      onSwipe();
    }
  };

  return (
    <motion.li
      className={isFirstCard ? Styles.card : `${Styles.card} ${Styles.inert}`}
      initial={getCardStateAtIndex(index)}
      whileHover={{
        scale: 1.1,
      }}
      whileDrag={{
        scale: 1.1,
      }}
      onDragEnd={onDragEnd}
      drag={isFirstCard}
      dragSnapToOrigin
      transition={CARD_SPRING}
      style={{
        zIndex: depth - index,
      }}
    >
      {isFirstCard ? (
        <button
          type="button"
          onClick={onActivate}
          aria-label={`next company, showing ${company.name}`}
          className={Styles.swipe}
        >
          {face}
        </button>
      ) : (
        face
      )}
    </motion.li>
  );
};

const Deck = ({ companies: initialCompanies, onRotate }) => {
  const [scope, animate] = useAnimate();
  const [companies, setCompanies] = useState(initialCompanies);

  const shouldRefocusRef = useRef(false);

  useEffect(() => {
    if (!shouldRefocusRef.current) {
      return;
    }

    shouldRefocusRef.current = false;
    scope.current.querySelector("li button")?.focus();
  }, [companies, scope]);

  const animateCompanies = () => {
    animate(
      "li:nth-child(1)",
      getCardStateAtIndex(companies.length - 1),
      CARD_TRANSITION,
    );

    companies.slice(1).forEach((_, position) => {
      animate(
        `li:nth-child(${position + 2})`,
        getCardStateAtIndex(position),
        CARD_TRANSITION,
      );
    });
  };

  const rotateCompanies = () => {
    const [front, ...rest] = companies;
    const rotated = [...rest, front];

    const { activeElement } = scope.current.ownerDocument;
    shouldRefocusRef.current = scope.current.contains(activeElement);

    animateCompanies();

    setCompanies(rotated);
    onRotate(rotated);
  };

  return (
    <motion.ul ref={scope} className={`${Styles.cardSize} ${Styles.deck}`}>
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
