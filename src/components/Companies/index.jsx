import React from "react";
import Styles from "./styles.module.scss";
import FutureGridLogo from "./logos/future-grid.png";
import LivePresoLogo from "./logos/livepreso.png";
import OriginEnergyLogo from "./logos/origin-energy.png";
import SeidoKarateLogo from "./logos/seido-karate.png";
import SwinburneLogo from "./logos/swinburne.png";

const logos = [
  {
    source: FutureGridLogo,
    description: "Future Grid",
    url: "https://future-grid.com/",
  },
  {
    source: LivePresoLogo,
    description: "LivePreso",
    url: "https://www.livepreso.com/",
  },
  {
    source: OriginEnergyLogo,
    description: "Origin Energy",
    url: "https://www.originenergy.com.au/",
  },
  {
    source: SeidoKarateLogo,
    description: "Seido Karate",
    url: "https://www.seidomelbourne.com.au/",
  },
  {
    source: SwinburneLogo,
    description: "Swinburne Uni",
    url: "https://www.swinburne.edu.au/",
  },
];

export default function Companies() {
  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>as seen on...</h2>
      <div className={Styles.companies}>
        {logos.map((logo) => (
          <a href={logo.url} className={Styles.logo}>
            <img
              className={Styles.logo}
              src={logo.source}
              alt={logo.description}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
