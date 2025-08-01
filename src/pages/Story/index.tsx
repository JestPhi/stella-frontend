import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddPage from "../../components/ButtonAddPage";
import PageCover from "../../components/PageCover";
import style from "./style.module.css";
import Logo from "../../components/Logo";

const Story = () => {
  const { stellaId, storyId } = useParams();
  const navigate = useNavigate();

  // TanStack Query for fetching story data
  const {
    data: story,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [storyId],
    queryFn: () => {
      return axios(
        `${import.meta.env.VITE_STELLA_APP_HOST}/story/${storyId}`
      ).then((response) => {
        return response.data.story;
        console.log(response);
      });
    },
  });

  // Show loading state
  if (isLoading) {
    return <div>Loading story...</div>;
  }

  // Show error state
  if (isError) {
    return <div>Error loading story: {error?.message}</div>;
  }

  return (
    <>
      <Bar className={style.topBar} variant="default">
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.story}>
        <PageCover
          stellaId={stellaId}
          storyId={storyId}
          panels={story?.coverPage}
          image={null}
        />
        {/* {pages.map((page, index) => {
          return <Page {...page} pageNumber={index} />;
        })} */}
      </div>
      <Bar className={style.bottomBar} variant="default">
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
