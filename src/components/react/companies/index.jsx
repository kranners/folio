import { motion } from "motion/react";
import { useRef, useState } from "react";

import PraxhubLogo from "./logos/praxhub.png";
import InlightLogo from "./logos/inlight.jpg";
import NandosLogo from "./logos/nandos.png";
import MakeAWishLogo from "./logos/make-a-wish.png";
import TacLogo from "./logos/tac.png";
import AhmLogo from "./logos/ahm.png";
import GoodHumanLogo from "./logos/goodhuman.png";
import LivePresoLogo from "./logos/livepreso.png";
import OriginEnergyLogo from "./logos/origin-energy.png";
import FutureGridLogo from "./logos/future-grid.png";
import SeidoKarateLogo from "./logos/seido-karate.png";
import SwinburneLogo from "./logos/swinburne.png";

import OnboardingHint from "../onboarding-hint/index.jsx";

import DealIcon from "./deal-icon.jsx";
import Deck from "./deck.jsx";
import Hand from "./hand.jsx";

const LOGOS = [
  {
    source: PraxhubLogo,
    description: "Praxhub",
    role: "senior software engineer",
    url: "https://praxhub.com/",
    blurb: "CPD platform for doctors, reporting directly to the CTO",
  },
  {
    source: InlightLogo,
    description: "Inlight",
    role: "senior software engineer",
    url: "https://www.inlight.com.au/",
    blurb: "Digital agency, many projects & many PowerPoints",
  },
  {
    source: NandosLogo,
    description: "Nando's",
    role: "mid-level engineer",
    url: "https://www.nandos.com.au/",
    blurb: "AU/NZ React Native app & web ordering platforms",
  },
  {
    source: MakeAWishLogo,
    description: "Make-A-Wish",
    role: "senior engineer, via inlight",
    url: "https://www.makeawish.org.au/",
    blurb: "Replatformed onto Astro, just like this site! 🚀",
  },
  {
    source: TacLogo,
    description: "TAC",
    role: "senior engineer, via inlight",
    url: "https://www.tac.vic.gov.au/",
    blurb: "Mobile-first interaction and motion heavy Next.js",
  },
  {
    source: AhmLogo,
    description: "AHM",
    role: "senior engineer",
    url: "https://www.ahm.com.au/",
    blurb: "Sales, member sites and mobile app, integrated with Salesforce",
  },
  {
    source: GoodHumanLogo,
    description: "GoodHuman",
    role: "software engineer",
    url: "https://goodhuman.me/",
    blurb: "NDIS platform. Full stack with Express, Knex, Prisma, React",
  },
  {
    source: LivePresoLogo,
    description: "LivePreso",
    role: "full stack engineer",
    url: "https://www.livepreso.com/",
    blurb: "Front-end, port to iOS using Cordova, CI/CD, Bitrise, codesigning",
  },
  {
    source: OriginEnergyLogo,
    description: "Origin Energy",
    role: "engineer",
    url: "https://www.originenergy.com.au/",
    blurb: "Brief stint - React & internal libraries, ask me about this one!",
  },
  {
    source: FutureGridLogo,
    description: "Future Grid",
    role: "devops engineer",
    url: "https://future-grid.com/",
    blurb: "Automating deployments saving manual days, K8s and Helm",
  },
  {
    source: SeidoKarateLogo,
    description: "Seido Karate",
    role: "admin and volunteer",
    url: "https://www.seidomelbourne.com.au/",
    blurb: "Teaching all ages as a volunteer instructor from 2016 to 2024.",
  },
  {
    source: SwinburneLogo,
    description: "Swinburne",
    role: "bachelor of comp. sci",
    url: "https://www.swinburne.edu.au/",
    blurb: "Majoring in software development, graduated 2021.",
  },
];

// A hand is five cards, or the whole deck if there aren't five to deal.
const HAND_SIZE = Math.min(5, LOGOS.length);

const pickRandom = (items, count) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }

  return shuffled.slice(0, count);
};

// No chrome of its own -- the drawing is the whole button. Sized off its
// height so the icon keeps its drawn proportions, and kept short enough that
// the button, its margin and a full-height card still clear an iPhone SE.
const BUTTON_CLASS_NAME =
  "cursor-pointer transition-colors " +
  "disabled:cursor-default disabled:opacity-50";

// The same spring the cards grow on, so reaching for the button feels like
// reaching for a card rather than a piece of chrome. A CSS ease would arrive
// and stop dead next to them.
const BUTTON_HOVER = { scale: 1.1 };
const BUTTON_SPRING = { type: "spring" };

// The drawing carries the pressed state in its own ink rather than in a border
// or a fill behind it, which would sit as a machine-drawn shape against
// hand-drawn strokes. Brown is the resting ink; white is the cards' own colour,
// so a hand that is out reads as lit up against the blue behind it.
const RESTING_INK = "text-[#4a230f]";
const PRESSED_INK = "text-white";

const Companies = () => {
  const [hand, setHand] = useState(null);
  const [isDealing, setIsDealing] = useState(false);
  const [isGathering, setIsGathering] = useState(false);
  const [deckLogos, setDeckLogos] = useState(LOGOS);
  const deckRef = useRef(null);

  // The three things there are to learn here, in the order they can be done.
  // Each one is a one-way latch: once it has happened its nudge is gone for
  // the rest of the visit.
  const [hasSwiped, setHasSwiped] = useState(false);
  const [hasDealt, setHasDealt] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  // The deck rotates under a swipe without remounting, so its live order lives
  // in a ref. Re-keying the deck mid-swipe would cut the animation short.
  const orderRef = useRef(LOGOS);

  // The card on top is the one being looked at, so it leads the hand. Only the
  // cards behind it are drawn at random.
  const deal = () => {
    const [top, ...rest] = orderRef.current;
    setHand([top, ...pickRandom(rest, HAND_SIZE - 1)]);
    setIsDealing(true);
    setHasDealt(true);
  };

  const gather = () => setIsGathering(true);

  const onRotate = (logos) => {
    orderRef.current = logos;
    setHasSwiped(true);
  };

  const onDealt = () => setIsDealing(false);

  // The hand lands on the top slots of the stack, so the deck has to come back
  // in that order for the swap to be invisible.
  const onGathered = () => {
    const dealt = new Set(hand.map((logo) => logo.url));
    const gathered = [
      ...hand,
      ...orderRef.current.filter((logo) => !dealt.has(logo.url)),
    ];

    orderRef.current = gathered;
    setDeckLogos(gathered);
    setHand(null);
    setIsGathering(false);
  };

  // The top padding only has to clear the logomark, which sits a fifth of the
  // way down the section. Any more than that and the bottom of the stack -- its
  // offset cards and their shadow -- falls off the end of a short viewport.
  return (
    <div className="w-screen h-dvh pt-[calc(20vh+2rem)] overflow-visible flex flex-col items-center justify-center">
      {/* The button and the nudge that stands in for it share one box, so the
          swap between them costs the row no height and the deck below never
          moves. The box is only as wide as the button, which gives the nudge
          beside it an edge to hang off. */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* There is nothing to deal until the deck has been touched, so until
            then the button is not there to be pressed. */}
        <motion.div
          animate={{ opacity: hasSwiped ? 1 : 0 }}
          className={hasSwiped ? "" : "pointer-events-none"}
        >
          <motion.button
            type="button"
            onClick={hand ? gather : deal}
            disabled={!hasSwiped || isDealing || isGathering}
            aria-pressed={Boolean(hand)}
            aria-label={hand ? "return to deck" : "deal a hand"}
            className={
              BUTTON_CLASS_NAME + " " + (hand ? PRESSED_INK : RESTING_INK)
            }
            whileHover={BUTTON_HOVER}
            transition={BUTTON_SPRING}
          >
            <DealIcon className="h-20 w-auto lg:h-28" />
          </motion.button>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <OnboardingHint isVisible={!hasSwiped}>
            try swiping around :)
          </OnboardingHint>
        </div>

        <div className="pointer-events-none absolute left-full top-1/2 ml-4 -translate-y-1/2">
          <OnboardingHint isVisible={hasSwiped && !hasDealt}>
            👈 click me
          </OnboardingHint>
        </div>
      </div>

      {/* The deck never leaves, even while the hand is out. It holds the row's
          place so nothing reflows, and it stays measurable so the cards can
          deal from and return to exactly where it sits. */}
      <div className="relative flex items-center justify-center">
        <div
          aria-hidden={Boolean(hand)}
          className={hand ? "opacity-0 pointer-events-none" : ""}
        >
          <Deck
            key={deckLogos.map((logo) => logo.url).join()}
            ref={deckRef}
            logos={deckLogos}
            onRotate={onRotate}
          />
        </div>

        {hand && (
          <Hand
            logos={hand}
            deckRef={deckRef}
            isGathering={isGathering}
            hasFlipped={hasFlipped}
            onFlip={() => setHasFlipped(true)}
            onDealt={onDealt}
            onGathered={onGathered}
          />
        )}
      </div>
    </div>
  );
};

export default Companies;
