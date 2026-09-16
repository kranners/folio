import { motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";

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

// The same spring the cards drag and grow on, so a card sent to the back
// travels at the speed a hand would send it. Left to itself `animate()` takes
// neither this nor the spring declared on the card -- it falls back to its own
// stiffer default, and the whole slide is over in a tenth of a second.
const CARD_SPRING = { type: "spring" };

// A returning card is under the stack but not covered by it until it lands, so
// the fade that hides it at rest has to hold off until then. The built-in
// default is a 0.3s ease-out -- three quarters of the fade spent in the first
// tenth of a second, while the card is still in plain sight, which reads as the
// card dissolving rather than sliding under.
const CARD_TRANSITION = {
  default: CARD_SPRING,
  opacity: { duration: 0.4, ease: "easeIn" },
};

// How far a card has to be thrown before the deck turns. The card has to end up
// clear of the stack it is being thrown off, so this is most of a card's width
// rather than a nudge -- under it the card springs back and nothing happens.
// A short flick has no distance to cover on the way home, so the return reads as
// the card twitching rather than as a card being sent to the back.
const SWIPE_DISTANCE = 100;

const DeckCard = ({ company, index, depth, onSwipe }) => {
  const isFirstCard = index === 0;
  const pointerEventsClassName = isFirstCard ? "" : "pointer-events-none";
  const face = (
    <CardFace logo={company.logo} name={company.name} role={company.role} />
  );

  // Distance from where the drag started, whichever way it went -- the card can
  // be thrown off in any direction, so neither axis on its own is the throw.
  const onDragEnd = (_event, { offset }) => {
    if (Math.hypot(offset.x, offset.y) >= SWIPE_DISTANCE) {
      onSwipe();
    }
  };

  // A click leaves the deck alone; only a throw turns it. Keyboard activation
  // is the exception and reports a click count of zero, which is the only thing
  // separating it from a mouse or a tap -- without it the deck could not be
  // turned without a pointer at all.
  const onActivate = (event) => {
    if (event.detail === 0) {
      onSwipe();
    }
  };

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
      onDragEnd={onDragEnd}
      // Any direction, and the card goes exactly where the pointer does: it is
      // being thrown off the deck, so it has to come away from it. No
      // constraints, so nothing rubber-bands against a boundary mid-throw;
      // snapping to the origin is what brings a throw that fell short home.
      drag={isFirstCard}
      dragSnapToOrigin
      transition={CARD_SPRING}
      // The flicked card is last in the list before its spring has finished,
      // which is the point: it drops behind the stack at once and slides home
      // underneath it, showing only the sliver of itself the cards in front
      // don't cover.
      style={{
        zIndex: depth - index,
      }}
    >
      {/* The deck's only affordance is a drag, which a keyboard cannot make.
          A real button rather than a role on the <li>, so the list keeps a
          valid child. */}
      {isFirstCard ? (
        <button
          type="button"
          onClick={onActivate}
          aria-label={`next company, showing ${company.name}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
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

  // Turning the deck takes the front card, and the button inside it, to the
  // back. Focus would land on nothing, so it is handed to the card that took
  // its place -- the deck is still there to be turned again.
  const shouldRefocusRef = useRef(false);

  useEffect(() => {
    if (!shouldRefocusRef.current) {
      return;
    }

    shouldRefocusRef.current = false;
    scope.current.querySelector("li button")?.focus();
  }, [companies, scope]);

  // The front card goes to the back, everything else moves forward one place.
  // Selectors, not state: this runs before the re-render, so nth-child still
  // counts the order the cards are leaving.
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
