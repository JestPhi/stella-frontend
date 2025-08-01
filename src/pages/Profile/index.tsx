import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddStory from "../../components/ButtonAddStory";
import PageCover from "../../components/PageCover";
import style from "./style.module.css";
import Profile from "../../components/Profile";
import Logo from "../../components/Logo";

const Author = ({}) => {
  const navigate = useNavigate();
  const { stellaId } = useParams();

  // TanStack Query for fetching stories by stellaId
  const {
    data: stories = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["stories", stellaId],
    queryFn: () => {
      return axios(
        `${import.meta.env.VITE_STELLA_APP_HOST}/stories/${stellaId}`
      ).then((response) => {
        return response.data.stories;
      });
    },
    enabled: !!stellaId,
  });

  // Show loading state
  if (isLoading) {
    return <div>Loading stories...</div>;
  }

  // Show error state
  if (isError) {
    return <div>Error loading stories: {error?.message}</div>;
  }

  return (
    <>
      <Bar className={style.topBar} variant="default">
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.stories}>
        <Profile />
        {stories.map((story: any) => {
          return (
            <PageCover
              key={story.id}
              stellaId={stellaId}
              storyId={story.storyId}
              panels={story.coverPage}
            />
          );
        })}
      </div>
      <Bar className={style.bottomBar} variant="default">
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
