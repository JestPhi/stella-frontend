import StellaLogo from "./logo.svg";
import styles from "./style.module.css";

export const Logo = () => {
  return <img className={styles.logo} src={StellaLogo} alt="Your SVG" />;
};

export default Logo;
