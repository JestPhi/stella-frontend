import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddPage from "../../components/ButtonAddPage";
import PageCover from "../../components/PageCover";
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

  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.story}>
        <PageCover
          stellaId={stellaId}
          storyId={storyId}
          panels={storyState?.coverPage}
          pageCount={pages.length}
        />
        {/* {pages.map((page, index) => {
          return <Page {...page} pageNumber={index} />;
        })} */}
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
