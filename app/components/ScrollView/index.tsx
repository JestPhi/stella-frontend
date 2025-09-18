import styles from "./style.module.css";

const ScrollView = ({ children }) => {
  return <div className={styles.scrollView}>{children}</div>;
};

export default ScrollView;
