import { useGlobalContext } from "../../context/Global";
import CreatePage from "../Buttons/CreatePage";
import CreateStory from "../Buttons/CreateStory";
import Home from "../Buttons/Home";
import Profile from "../Buttons/Profile";
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
