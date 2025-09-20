import Styles from "./styles.module.scss";
import FutureGridLogo from "./logos/future-grid.png";
import LivePresoLogo from "./logos/livepreso.png";
import InlightLogo from "./logos/inlight.jpg";
import SeidoKarateLogo from "./logos/seido-karate.png";
import SwinburneLogo from "./logos/swinburne.png";

const LOGOS = [
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
    source: InlightLogo,
    description: "Inlight",
    url: "https://www.inlight.com.au/",
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
        {LOGOS.map((logo) => (
          <a href={logo.url} className={Styles.logo}>
            <img
              className={Styles.logo}
              src={logo.source.src}
              alt={logo.description}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
