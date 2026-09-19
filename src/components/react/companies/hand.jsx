import { motion, useAnimate } from "motion/react";
import { useLayoutEffect, useState } from "react";

import OnboardingHint from "../onboarding-hint/index.jsx";

import { CardFace, CardBack } from "./card-face.jsx";
import { getCardOffset } from "./deck.jsx";

import Styles from "./styles.module.css";

const DEAL_STAGGER_SECONDS = 0.12;

const FLIGHT = { type: "spring", bounce: 0.25 };

const LANDING = { type: "spring", bounce: 0 };

const HIDE_BACKFACE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

const getCentre = ({ x, y, width, height }) => ({
  x: x + width / 2,
  y: y + height / 2,
});

const getRestingOnDeck = (card, deckRect, index) => {
  const cardRect = card.getBoundingClientRect();
  const cardCentre = getCentre(cardRect);
  const deckCentre = getCentre(deckRect);
  const offset = getCardOffset(index);

  return {
    x: deckCentre.x + offset - cardCentre.x,
    y: deckCentre.y + offset - cardCentre.y,
    scale: deckRect.width / cardRect.width,
  };
};

const HandCard = ({
  company,
  depth,
  index,
  isFlipped,
  isGathering,
  onFlip,
  children,
}) => {
  const restingZIndex = depth - index;

  return (
    <motion.li
      className={`${Styles.slot} ${Styles.cardSize}`}
      style={{ perspective: 1000, zIndex: restingZIndex }}
      whileHover={{ zIndex: isGathering ? restingZIndex : depth + 1 }}
    >
      <motion.button
        type="button"
        aria-pressed={isFlipped}
        aria-label={`flip ${company.name}`}
        onClick={onFlip}
        className={Styles.flipper}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: isGathering ? 1 : 1.1 }}
        transition={FLIGHT}
      >
        <div className={Styles.faceLayer} style={HIDE_BACKFACE}>
          <CardFace
            logo={company.logo}
            name={company.name}
            role={company.role}
          />
        </div>

        <div
          className={Styles.faceLayer}
          style={{ ...HIDE_BACKFACE, transform: "rotateY(180deg)" }}
        >
          <CardBack
            logo={company.logo}
            name={company.name}
            blurb={company.blurb}
          />
        </div>
      </motion.button>

      {children}
    </motion.li>
  );
};

const Hand = ({
  companies,
  deckRef,
  isGathering,
  hasFlipped,
  onFlip,
  onDealt,
  onGathered,
}) => {
  const [scope, animate] = useAnimate();
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (url) => {
    setFlipped((current) => ({ ...current, [url]: !current[url] }));
    onFlip();
  };

  const flyEveryCard = (animateCard) => {
    const deckRect = deckRef.current.getBoundingClientRect();
    const cards = [...scope.current.querySelectorAll("li")];

    return Promise.all(
      cards.map((card, index) =>
        animateCard(
          card,
          getRestingOnDeck(card, deckRect, index),
          index,
          cards.length,
        ),
      ),
    );
  };

  useLayoutEffect(() => {
    flyEveryCard((card, { x, y, scale }, index) =>
      animate(
        card,
        { x: [x, 0], y: [y, 0], scale: [scale, 1] },
        { ...FLIGHT, delay: index * DEAL_STAGGER_SECONDS },
      ),
    ).then(onDealt);
  }, []);

  useLayoutEffect(() => {
    if (!isGathering) {
      return;
    }

    setFlipped({});

    flyEveryCard((card, resting, index, count) =>
      animate(card, resting, {
        ...LANDING,
        delay: (count - 1 - index) * DEAL_STAGGER_SECONDS,
      }),
    ).then(onGathered);
  }, [isGathering]);

  return (
    <ul ref={scope} className={Styles.hand}>
      {companies.map((company, index) => (
        <HandCard
          key={company.url}
          company={company}
          index={index}
          depth={companies.length}
          isFlipped={Boolean(flipped[company.url])}
          isGathering={isGathering}
          onFlip={() => toggleFlip(company.url)}
        >
          {index === 0 && (
            <div className={Styles.hint}>
              <OnboardingHint isVisible={!hasFlipped}>
                tap me to flip
              </OnboardingHint>
            </div>
          )}
        </HandCard>
      ))}
    </ul>
  );
};

export default Hand;
