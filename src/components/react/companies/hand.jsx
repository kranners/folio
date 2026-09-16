import { motion, useAnimate } from "motion/react";
import { useLayoutEffect, useState } from "react";

import OnboardingHint from "../onboarding-hint/index.jsx";

import { CardFace, CardBack, CARD_SIZE } from "./card-face.jsx";
import { getCardOffset } from "./deck.jsx";

// Each card leaves the stack a beat after the one before it, so the hand reads
// as dealt rather than as appearing all at once.
const DEAL_STAGGER_SECONDS = 0.12;

const FLIGHT = { type: "spring", bounce: 0.25 };

// Cards land on the stack rather than bouncing off it.
const LANDING = { type: "spring", bounce: 0 };

const HIDE_BACKFACE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

// Centres, rather than corners, because a scaled card grows about its middle.
const getCentre = ({ x, y, width, height }) => ({
  x: x + width / 2,
  y: y + height / 2,
});

// Where a card has to sit to be its own slot in the stack.
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
      className={"relative shrink-0 snap-center " + CARD_SIZE}
      style={{ perspective: 1000, zIndex: restingZIndex }}
      // Hovering only has to bring the card forward of the one to its left.
      // A gathering card gives that up again, so it does not land on top of a
      // stack it is not the front of.
      whileHover={{ zIndex: isGathering ? restingZIndex : depth + 1 }}
    >
      <motion.button
        type="button"
        aria-pressed={isFlipped}
        aria-label={`flip ${company.name}`}
        onClick={onFlip}
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: isGathering ? 1 : 1.1 }}
        transition={FLIGHT}
      >
        <div className="absolute inset-0" style={HIDE_BACKFACE}>
          <CardFace
            logo={company.logo}
            name={company.name}
            role={company.role}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ ...HIDE_BACKFACE, transform: "rotateY(180deg)" }}
        >
          <CardBack
            logo={company.logo}
            name={company.name}
            blurb={company.blurb}
          />
        </div>
      </motion.button>

      {/* Outside the flipping button, so the nudge stays the right way round
          while the card it is asking about turns over. */}
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

  // Park every card on its own slot in the stack before the first paint, then
  // send them out one at a time. Stated as explicit from/to keyframes so a card
  // holds on the deck for the length of its delay.
  useLayoutEffect(() => {
    flyEveryCard((card, { x, y, scale }, index) =>
      animate(
        card,
        { x: [x, 0], y: [y, 0], scale: [scale, 1] },
        { ...FLIGHT, delay: index * DEAL_STAGGER_SECONDS },
      ),
    ).then(onDealt);
    // Dealing happens once, when the hand first appears.
  }, []);

  // Gathering is the reverse: the far end of the row goes back first, so the
  // card that ends up on top of the stack is the last one to land.
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

  // pt-16 and -top-16 must match, so the row lands back over the deck it
  // covers. The rest of the padding clears the cards' shadow, which scrolling
  // sideways would otherwise clip.
  return (
    <ul
      ref={scope}
      className="absolute left-1/2 -top-16 -translate-x-1/2 w-screen flex flex-row items-center gap-4 px-8 pt-16 pb-20 overflow-x-auto snap-x snap-mandatory lg:overflow-x-visible lg:justify-center"
    >
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
            <div className="pointer-events-none absolute inset-x-0 bottom-full mb-2 flex justify-center">
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
