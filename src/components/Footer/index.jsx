import Styles from "./styles.module.scss";

function Footer() {
  return (
    <footer className={Styles.footer}>
      {new Date().getFullYear()} Aaron Pierce
      <small className={Styles.byline}>
        🚀 Powered by Astro 🚀
      </small>
    </footer>
  );
}

export default Footer;
