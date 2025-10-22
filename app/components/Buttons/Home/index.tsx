"use client";
import { useRouter } from "next/navigation";
import Anchor from "../../Anchor";
import Logo from "./logo";
import styles from "./style.module.css";

const Home = () => {
  const router = useRouter();
  return (
    <Anchor
      href="/"
    >
      <Logo className={styles.home} />
    </Anchor>
  );
};

export default Home;
