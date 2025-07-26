import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
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
import { getStory } from "../../api";

const Story = () => {
  const { pages } = storyData;
  const [storyState, setStoryState] = useState();
  const { stellaId, storyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getStory(stellaId, storyId).then((data) => {
      setStoryState(data);
    });
  }, []);
  console.log(storyState);
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
          imageBlob={`${
            import.meta.env.VITE_STORJ_PUBLIC_URL
          }/${stellaId}/stories/${storyId}/${
            storyState?.coverPage.imageURL
          }?wrap=0`}
          title={storyState?.coverPage.title}
          pageCount={pages.length}
        />
        {pages.map((page, index) => {
          return <Page {...page} pageNumber={index} />;
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
        <ButtonAddPage />
      </Bar>
    </>
  );
};

export default Story;
