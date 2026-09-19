import Styles from "./card-face.module.css";

const CardShell = ({ className, children }) => (
  <div className={`${Styles.shell} ${className}`}>{children}</div>
);

export const CardFace = ({ logo, name, role }) => {
  return (
    <CardShell className={Styles.face}>
      <img src={logo.src} alt={name} className={Styles.logo} />

      <p className={Styles.name}>{name}</p>
      <p className={Styles.role}>{role}</p>
    </CardShell>
  );
};

export const CardBack = ({ logo, name, blurb }) => {
  return (
    <CardShell className={Styles.back}>
      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        className={`${Styles.corner} ${Styles.topLeft}`}
      />

      <p className={`${Styles.name} ${Styles.backName}`}>{name}</p>
      <p className={Styles.blurb}>{blurb}</p>

      <img
        src={logo.src}
        alt=""
        aria-hidden="true"
        className={`${Styles.corner} ${Styles.bottomRight}`}
      />
    </CardShell>
  );
};
