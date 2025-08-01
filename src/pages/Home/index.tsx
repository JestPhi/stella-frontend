import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Masonry from "react-responsive-masonry";
import { useNavigate } from "react-router";
import Bar from "../../components/Bar";
import Search from "../../components/Search";
import Story from "../../components/Story";
import Button from "../../components/Button";
import ButtonProfile from "../../components/ButtonProfile";
import ButtonAddStory from "../../components/ButtonAddStory";
import Logo from "../../components/Logo";
import Panels from "../../components/Panels";

import style from "./style.module.css";

const Home = () => {
  const navigate = useNavigate();
  // TanStack Query for fetching all stories
  const {
    data: stories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stories"],
    queryFn: () => {
      return axios(`${import.meta.env.VITE_STELLA_APP_HOST}/stories`).then(
        (response) => {
          return response.data.stories;
        }
      );
    },
  });
  console.log(stories);
  // Show loading state
  if (isLoading) {
    return (
      <div>
        <Bar className={style.topBar} variant="default">
          <Search />
          <ButtonProfile />
        </Bar>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading stories...
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div>
        <Bar className={style.topBar} variant="default">
          <Search />
          <ButtonProfile />
        </Bar>
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading stories: {error?.message}
        </div>
      </div>
    );
  }
  return (
    <div>
      <Bar className={style.topBar} variant="default">
        <Search />
        <ButtonProfile />
      </Bar>
      <div className={style.stories}>
        <Masonry columnsCount={2} gutter="8px">
          {stories.map((story: any, index: number) => {
            return (
              <div
                className={style.story}
                onClick={() => {
                  navigate(`/profile/${story.stellaId}/${story.storyId}`);
                }}
              >
                <img
                  src={`${import.meta.env.VITE_STORJ_PUBLIC_URL}/${
                    story.coverPage[`0`].value
                  }?wrap=0`}
                />
                <div className={style.title}>{story.coverPage[`1`].value}</div>
              </div>
            );
          })}
        </Masonry>
      </div>
      <Bar className={style.bottomBar} variant="default">
        <Button>
          <Logo />
        </Button>
        <ButtonAddStory />
      </Bar>
    </div>
  );
};

export default Home;
