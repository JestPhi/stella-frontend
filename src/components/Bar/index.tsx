import styles from "./styles.module.css";

const Bar = ({ background, children, className, position, variant }) => {
  return (
    <div
      className={[
        styles.bar,
        styles[background],
        styles[position],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export default Bar;
