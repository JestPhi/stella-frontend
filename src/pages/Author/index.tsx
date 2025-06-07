import Avatar from "../../components/Avatar";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonMenu";
import ButtonUser from "../../components/ButtonUser";
import ButtonAddStory from "../../components/ButtonAddStory";
import PageCover from "../../components/PageCover";
import style from "./style.module.css";
import Profile from "../../components/Profile";

const Author = ({}) => {
  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.stories}>
        <Profile />
        <PageCover />
        <PageCover />
        <PageCover />
        <PageCover />
      </div>
      <Bar className={style.bottomBar}>
        <Button>S</Button>
        <ButtonAddStory />
      </Bar>
    </>
  );
};

export default Author;
