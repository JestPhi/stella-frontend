import { Menu } from "react-feather";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonMenu";
import ButtonAddStory from "../../components/ButtonAddStory";
import PageCover from "../../components/PageCover";
import Page from "../../components/Page";
import Profile from "../../components/Profile";
import style from "./style.module.css";

const Story = () => {
  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <Profile />
      <div className={style.story}>
        <PageCover isStory={true} />
        <Page />
        <Page />
        <Page />
      </div>
      <Bar className={style.bottomBar}>
        <Button>S</Button>
        <ButtonAddStory />
      </Bar>
    </>
  );
};

export default Story;
