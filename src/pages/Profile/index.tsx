import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddStory from "../../components/ButtonAddStory";
import PageCover from "../../components/PageCover";
import style from "./style.module.css";
import Profile from "../../components/Profile";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router";

const Author = ({}) => {
  const navigate = useNavigate();
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
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          <Logo />
        </Button>
        <ButtonAddStory />
      </Bar>
    </>
  );
};

export default Author;
