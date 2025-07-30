import styles from "./styles.module.css";

const Bar = ({ children, className, variant }) => {
  return (
    <div className={[styles.bar, className, styles[variant]].join(" ")}>
      {children}
    </div>
  );
};

export default Bar;
