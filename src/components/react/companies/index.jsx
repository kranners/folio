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

import Styles from "./index.module.css";

const COMPANIES = [
  {
    logo: PraxhubLogo,
    name: "Praxhub",
    role: "senior software engineer",
    url: "https://praxhub.com/",
    blurb: "CPD platform for doctors, reporting directly to the CTO",
  },
  {
    logo: InlightLogo,
    name: "Inlight",
    role: "senior software engineer",
    url: "https://www.inlight.com.au/",
    blurb: "Digital agency, many projects & many PowerPoints",
  },
  {
    logo: NandosLogo,
    name: "Nando's",
    role: "mid-level engineer",
    url: "https://www.nandos.com.au/",
    blurb: "AU/NZ React Native app & web ordering platforms",
  },
  {
    logo: MakeAWishLogo,
    name: "Make-A-Wish",
    role: "senior engineer, via inlight",
    url: "https://www.makeawish.org.au/",
    blurb: "Replatformed onto Astro, just like this site! 🚀",
  },
  {
    logo: TacLogo,
    name: "TAC",
    role: "senior engineer, via inlight",
    url: "https://www.tac.vic.gov.au/",
    blurb: "Mobile-first interaction and motion heavy Next.js",
  },
  {
    logo: AhmLogo,
    name: "AHM",
    role: "senior engineer",
    url: "https://www.ahm.com.au/",
    blurb: "Sales, member sites and mobile app, integrated with Salesforce",
  },
  {
    logo: GoodHumanLogo,
    name: "GoodHuman",
    role: "software engineer",
    url: "https://goodhuman.me/",
    blurb: "NDIS platform. Full stack with Express, Knex, Prisma, React",
  },
  {
    logo: LivePresoLogo,
    name: "LivePreso",
    role: "full stack engineer",
    url: "https://www.livepreso.com/",
    blurb: "Front-end, port to iOS using Cordova, CI/CD, Bitrise, codesigning",
  },
  {
    logo: OriginEnergyLogo,
    name: "Origin Energy",
    role: "engineer",
    url: "https://www.originenergy.com.au/",
    blurb: "Brief stint - React & internal libraries, ask me about this one!",
  },
  {
    logo: FutureGridLogo,
    name: "Future Grid",
    role: "devops engineer",
    url: "https://future-grid.com/",
    blurb: "Automating deployments saving manual days, K8s and Helm",
  },
  {
    logo: SeidoKarateLogo,
    name: "Seido Karate",
    role: "admin and volunteer",
    url: "https://www.seidomelbourne.com.au/",
    blurb: "Teaching all ages as a volunteer instructor from 2016 to 2024.",
  },
  {
    logo: SwinburneLogo,
    name: "Swinburne",
    role: "bachelor of comp. sci",
    url: "https://www.swinburne.edu.au/",
    blurb: "Majoring in software development, graduated 2021.",
  },
];

const HAND_SIZE = 5;

const pickRandom = (items, count) => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }

  return shuffled.slice(0, count);
};

const BUTTON_HOVER = { scale: 1.1 };
const BUTTON_SPRING = { type: "spring" };

const Companies = () => {
  const [hand, setHand] = useState(null);
  const [isDealing, setIsDealing] = useState(false);
  const [isGathering, setIsGathering] = useState(false);
  const [deckCompanies, setDeckCompanies] = useState(COMPANIES);
  const deckRef = useRef(null);

  const [dealCount, setDealCount] = useState(0);

  const [hasSwiped, setHasSwiped] = useState(false);
  const [hasDealt, setHasDealt] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  const orderRef = useRef(COMPANIES);

  const deal = () => {
    const [top, ...rest] = orderRef.current;
    setHand([top, ...pickRandom(rest, HAND_SIZE - 1)]);
    setIsDealing(true);
    setHasDealt(true);
  };

  const gather = () => setIsGathering(true);

  const onRotate = (companies) => {
    orderRef.current = companies;
    setHasSwiped(true);
  };

  const onDealt = () => setIsDealing(false);

  const onGathered = () => {
    const dealt = new Set(hand.map((company) => company.url));
    const gathered = [
      ...hand,
      ...orderRef.current.filter((company) => !dealt.has(company.url)),
    ];

    orderRef.current = gathered;
    setDeckCompanies(gathered);
    setDealCount((count) => count + 1);
    setHand(null);
    setIsGathering(false);
  };

  return (
    <div className={Styles.frame}>
      <div className={Styles.controls}>
        <motion.div animate={{ opacity: hasSwiped ? 1 : 0 }}>
          <motion.button
            type="button"
            onClick={hand ? gather : deal}
            disabled={!hasSwiped || isDealing || isGathering}
            aria-pressed={Boolean(hand)}
            aria-label={hand ? "return to deck" : "deal a hand"}
            className={`${Styles.dealButton} ${hand ? Styles.pressed : Styles.resting}`}
            whileHover={BUTTON_HOVER}
            transition={BUTTON_SPRING}
          >
            <DealIcon className={Styles.dealIcon} />
          </motion.button>
        </motion.div>

        <div className={Styles.centreHint}>
          <OnboardingHint isVisible={!hasSwiped}>
            try swiping around :)
          </OnboardingHint>
        </div>

        <div className={Styles.sideHint}>
          <OnboardingHint isVisible={hasSwiped && !hasDealt}>
            👈 click me
          </OnboardingHint>
        </div>
      </div>

      <div className={Styles.stage}>
        <div
          ref={deckRef}
          aria-hidden={Boolean(hand)}
          className={hand ? Styles.hidden : undefined}
        >
          <Deck key={dealCount} companies={deckCompanies} onRotate={onRotate} />
        </div>

        {hand && (
          <Hand
            companies={hand}
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
