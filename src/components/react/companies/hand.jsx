import { motion, useAnimate } from "motion/react";
import { useLayoutEffect, useState } from "react";

import CardFace, { CardBack, CARD_SIZE } from "./card-face.jsx";
import { getCardOffset } from "./deck.jsx";

// Each card leaves the stack a beat after the one before it, so the hand reads
// as dealt rather than as appearing all at once.
const DEAL_STAGGER_SECONDS = 0.12;

const FLIGHT = { type: "spring", bounce: 0.25 };

// Cards land on the stack rather than bouncing off it, so the return settles
// into the deck instead of overshooting it.
const LANDING = { type: "spring", bounce: 0 };

const FACE_STYLE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

// Where a card has to sit to be its own slot in the stack. Matched by centre,
// not by corner, because a scaled card grows about its middle -- lining the
// left edges up would leave it half the size difference out of place.
const getRestingOnDeck = (element, deck, index) => {
  const card = element.getBoundingClientRect();
  const offset = getCardOffset(index);

  return {
    x: deck.x + offset + deck.width / 2 - (card.x + card.width / 2),
    y: deck.y + offset + deck.height / 2 - (card.y + card.height / 2),
    scale: deck.width / card.width,
  };
};

const HandCard = ({ logo, depth, index, isFlipped, isGathering, onFlip }) => {
  const onKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onFlip();
  };

  return (
    <motion.li
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`flip ${logo.description}`}
      onClick={onFlip}
      onKeyDown={onKeyDown}
      className={"shrink-0 snap-center cursor-pointer " + CARD_SIZE}
      style={{ perspective: 1000, zIndex: depth - index }}
      // The li's own transform belongs to the deal and the gather, so the
      // hover lives on the wrapper below. All this needs is to come forward,
      // or the card to its left would be grown over the top of it.
      //
      // A gathering card gives that up again: it is landing on its own slot in
      // the stack, and a card held at the front of a stack it is not the front
      // of would vanish behind the others the moment the deck takes over.
      // Stated as a value rather than dropped so a card already under the
      // pointer settles back too, instead of staying where the hover left it.
      whileHover={{ zIndex: isGathering ? depth - index : depth + 1 }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        whileHover={{ scale: isGathering ? 1 : 1.1 }}
        transition={FLIGHT}
      >
        <div className="absolute inset-0" style={FACE_STYLE}>
          <CardFace
            source={logo.source}
            description={logo.description}
            role={logo.role}
          />
        </div>

        <div
          className="absolute inset-0"
          style={{ ...FACE_STYLE, transform: "rotateY(180deg)" }}
        >
          <CardBack
            source={logo.source}
            description={logo.description}
            blurb={logo.blurb}
          />
        </div>
      </motion.div>
    </motion.li>
  );
};

const Hand = ({ logos, deckRef, isGathering, onDealt, onGathered }) => {
  const [scope, animate] = useAnimate();
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (url) =>
    setFlipped((current) => ({ ...current, [url]: !current[url] }));

  // Park every card on its own slot in the stack before the first paint, then
  // send them out one at a time. Laying the offsets in during a layout effect
  // keeps the row from flashing into place first.
  useLayoutEffect(() => {
    const deck = deckRef.current.getBoundingClientRect();
    const cards = [...scope.current.querySelectorAll("li")];

    // The hand can't be gathered until it has landed: the offsets below are
    // measured off a card sitting still, so a return that starts mid-flight
    // would aim at the wrong place.
    Promise.all(
      cards.map((card, index) => {
        const { x, y, scale } = getRestingOnDeck(card, deck, index);

        // Stated as explicit from/to keyframes so the card holds on the deck
        // for the length of its delay instead of starting from wherever it
        // renders.
        return animate(
          card,
          { x: [x, 0], y: [y, 0], scale: [scale, 1] },
          { ...FLIGHT, delay: index * DEAL_STAGGER_SECONDS },
        );
      }),
    ).then(onDealt);
    // Dealing happens once, when the hand first appears.
  }, []);

  // Gathering is the reverse: the far end of the row goes back first, so the
  // card that ends up on top of the stack is the last one to land.
  useLayoutEffect(() => {
    if (!isGathering) {
      return;
    }

    const deck = deckRef.current.getBoundingClientRect();
    const cards = [...scope.current.querySelectorAll("li")];

    setFlipped({});

    Promise.all(
      cards.map((card, index) =>
        animate(card, getRestingOnDeck(card, deck, index), {
          ...LANDING,
          delay: (cards.length - 1 - index) * DEAL_STAGGER_SECONDS,
        }),
      ),
    ).then(onGathered);
  }, [isGathering]);

  // Scrolling sideways makes this a scroll container, which clips the other
  // axis too -- so the cards' shadow has to fit inside the padding. The bottom
  // needs the most room: a card starts the deal sitting on its slot in the
  // stack, up to a whole stack offset below where it lands, and its shadow
  // reaches a good way further down again.
  //
  // Anchored by its top edge rather than centred on its own box, so the extra
  // room below doesn't drag the row down with it. A card is as tall as the
  // deck it covers, so pulling the box up by its own top padding lines the two
  // up exactly.
  return (
    <ul
      ref={scope}
      className="absolute left-1/2 -top-10 -translate-x-1/2 w-screen flex flex-row items-center gap-4 px-8 pt-10 pb-20 overflow-x-auto snap-x snap-mandatory lg:overflow-x-visible lg:justify-center"
    >
      {logos.map((logo, index) => (
        <HandCard
          key={logo.url}
          logo={logo}
          index={index}
          depth={logos.length}
          isFlipped={Boolean(flipped[logo.url])}
          isGathering={isGathering}
          onFlip={() => toggleFlip(logo.url)}
        />
      ))}
    </ul>
  );
};

export default Hand;
