import Bar from "../../components/Bar";
import Search from "../../components/Search";
import Story from "../../components/Story";
import style from "./style.module.css";
import Button from "../../components/Button";
import ButtonMenu from "../../components/ButtonMenu";
import ButtonAddStory from "../../components/ButtonAddStory";

const Home = () => {
  return (
    <div>
      <Bar className={style.topBar}>
        <Search />
        <ButtonMenu />
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
        <Button>S</Button>
        <ButtonAddStory />
      </Bar>
    </div>
  );
};

export default Home;
