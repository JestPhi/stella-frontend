import CreatePage from "@/components/Buttons/CreatePage";
import CreateStory from "@/components/Buttons/CreateStory";
import Home from "@/components/Buttons/Home";
import Profile from "@/components/Buttons/Profile";
import { useGlobalContext } from "@/context/Global";
import styles from "./style.module.css";

const Navigation = () => {
  const {
    state: { stellaId },
  } = useGlobalContext();

  return (
    <div className={styles.navigation}>
      <Home />
      <CreatePage />
      <CreateStory />
      <Profile />
    </div>
  );
};

export default Navigation;
