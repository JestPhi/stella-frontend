import styles from "./styles.module.css";

const Bar = ({ children, className }) => {
  return <div className={[styles.bar, className].join(" ")}>{children}</div>;
};

export default Bar;
