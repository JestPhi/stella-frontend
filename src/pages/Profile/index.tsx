import { useEffect, useState } from "react";
import { useParams } from "react-router";
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
import { getStories } from "../../api";

const Author = ({}) => {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  const { stellaId } = useParams();

  useEffect(() => {
    getStories(stellaId).then((data) => {
      setStories(data);
    });
  }, []);

  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.stories}>
        <Profile />
        {stories.map((story) => {
          console.log(story);
          return (
            <PageCover
              image={story.coverImageURL}
              stellaId={stellaId}
              storyId={story.id}
              title={story.title}
            />
          );
        })}
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
