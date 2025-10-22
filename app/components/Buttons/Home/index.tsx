"use client";

import Anchor from "../../Anchor";
import Logo from "./logo";
import styles from "./style.module.css";

const Home = () => {
  return (
    <Anchor href="/">
      <Logo className={styles.home} />
    </Anchor>
  );
};

export default Home;
