import React from "react";
import ReactLogo from "./logos/react.svg";
import PreactLogo from "./logos/preact.svg";
import SvelteLogo from "./logos/svelte.svg";
import VueLogo from "./logos/vue.svg";

// Mappings for each language's brand color for highlighting the text
const brandingColors = {
  preact: "#673ab8",
  react: "#00d8ff",
  vue: "#42b883",
  svelte: "#FF3E00",
};

// Mappings for each language's logo for displaying next to the text
const brandingLogos = {
  preact: PreactLogo,
  react: ReactLogo,
  svelte: SvelteLogo,
  vue: VueLogo,
};

const containerStyle = {
  position: "absolute",
  top: "1em",
  left: "1em",
  height: "2em",
  display: "flex",
  alignItems: "center",
  width: "50%",
  margin: "auto",
  opacity: 0.3,
};

const logoStyle = {
  paddingLeft: "5px",
  maxHeight: "100%",
};

// Language showoff footer for displaying which framework each part of the page was written in
export default function LanguageFooter({ language }) {
  const brandStyle = {
    color: brandingColors[language],
    textTransform: "capitalize",
  };

  return (
    <span style={containerStyle}>
      <p>
        This part was written in <span style={brandStyle}>{language}</span>
      </p>
      <img style={logoStyle} src={brandingLogos[language]} />
    </span>
  );
}
