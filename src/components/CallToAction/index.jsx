import Styles from "./styles.module.scss";

import LinkedinIcon from "./socials/linkedin.svg";

const magicWord = Array.from("let's make ✨ magic ✨ happen.");

export default function CallToAction() {
  let characters = [];
  for (let i = 0; i < magicWord.length; i++) {
    characters.push(
      <span
        key={i}
        className={Styles.character}
        style={{
          animationDelay: `-${(i / magicWord.length) * 2}s`,
        }}
      >
        {magicWord[i]}
      </span>
    );
  }

  return (
    <div className={Styles.container}>
      <h1 className={Styles.title}>{characters}</h1>
      <p className={Styles.paragraph}>
        contact me at{" "}
        <a href="mailto:aaron@cute.engineer">aaron@cute.engineer</a>
      </p>
      <p className={Styles.paragraph}>
        <a href="https://www.linkedin.com/in/aajrp/">
          reach out on linkedin here
          <img className={Styles.icon} src={LinkedinIcon.src} alt="Linkedin Icon" />
        </a>
      </p>
      <p className={Styles.paragraph}>
        want to see how this spell was cast?{" "}
        <a href="https://github.com/kranners/folio">
          check out the repo here
        </a>
      </p>
    </div>
  );
}
