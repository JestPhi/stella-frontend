"use client";
import { useRouter } from "next/navigation";
import Button from "../../Button";
import Logo from "./logo";
import styles from "./style.module.css";

const Home = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("/");
      }}
    >
      <Logo className={styles.home} />
    </Button>
  );
};

export default Home;
