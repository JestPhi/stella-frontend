import styles from "./styles.module.css";

const Bar = ({
  children,
  className,
  variant,
}: {
  children: any;
  className?: any;
  variant?: any;
}) => {
  return (
    <div
      className={[styles.bar, className, variant ? styles[variant] : ""]
        .join(" ")
        .trim()}
    >
      {children}
    </div>
  );
};

export default Bar;
