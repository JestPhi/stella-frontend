import Bar from "../../components/Bar";
import Search from "../../components/Search";
import Story from "../../components/Story";
import style from "./style.module.css";
import Button from "../../components/Button";
import ButtonProfile from "../../components/ButtonProfile";
import ButtonAddStory from "../../components/ButtonAddStory";
import Logo from "../../components/Logo";

const Home = () => {
  return (
    <div>
      <Bar className={style.topBar}>
        <Search />
        <ButtonProfile />
      </Bar>
      <div className={style.stories}>
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
        <Story />
      </div>
      <Bar className={style.bottomBar}>
        <Button>
          <Logo />
        </Button>
        <ButtonAddStory />
      </Bar>
    </div>
  );
};

export default Home;
