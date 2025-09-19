import { ReactNode } from "react";
import styles from "./style.module.css";

interface ScrollViewProps {
  children: ReactNode;
}

const ScrollView = ({ children }: ScrollViewProps) => {
  return <div className={styles.scrollView}>{children}</div>;
};

export default ScrollView;
