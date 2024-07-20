import { h } from "preact";
import Styles from "./styles.module.scss";

function Nav() {
  return (
    <nav className={Styles.nav}>
      <a
        className={Styles.social}
        href="https://www.linkedin.com/in/aajrp/"
      ></a>
      <a className={Styles.social} href="https://github.com/kranners"></a>
      <a
        className={Styles.social}
        href="https://gitlab.com/kranners/polyfolio"
      ></a>
    </nav>
  );
}
export default Nav;
