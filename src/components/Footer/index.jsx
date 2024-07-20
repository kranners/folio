// Required for Astro loading, despite being unused
import { h } from "preact";
import Styles from "./styles.module.scss";

function Footer() {
  return (
    <footer className={Styles.footer}>
      {new Date().getFullYear()} Aaron Pierce
      <small className={Styles.byline}>
        🚀 Powered by Astro and fullPage.js 🚀
      </small>
    </footer>
  );
}
export default Footer;
