import { useEffect, useState } from "react";
import { Menu } from "react-feather";
import { useParams } from "react-router";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddPage from "../../components/ButtonAddPage";
import PageCover from "../../components/PageCover";
import Page from "../../components/Page";
import Profile from "../../components/Profile";
import style from "./style.module.css";
import storyData from "../../scheme/story.json";
import Logo from "../../components/Logo";
import PouchDb from "pouchdb-browser";
import { getStory } from "../../api";

const Story = () => {
  const { coverPage, pages } = storyData;
  const [storyState, setStoryState] = useState();

  const { profileId, storyId } = useParams();

  useEffect(() => {
    getStory(profileId, storyId).then((data) => {
      setStoryState(data);
    });
  }, []);

  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.story}>
        <Profile />
        <PageCover
          isStory={true}
          imageBlob={storyState?.coverPage.imageBlob}
          title={storyState?.coverPage.title}
          pageCount={pages.length}
        />
        {pages.map((page, index) => {
          return <Page {...page} pageNumber={index} />;
        })}
      </div>
      <Bar className={style.bottomBar}>
        <Button>
          <Logo />
        </Button>
        <ButtonAddPage />
      </Bar>
    </>
  );
};

export default Story;
