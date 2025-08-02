import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { storyAPI } from "../../api/story";
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
  const queryClient = useQueryClient();

  // TanStack Query for fetching story data
  const {
    data: storyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyAPI.getById(storyId!),
    enabled: !!storyId,
    staleTime: 0, // Always refetch on focus/mount
  });

  const story = storyData?.story;

  // TanStack Query for fetching profile data by stellaId
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", stellaId],
    queryFn: () => {
      return axios(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}`
      ).then((response) => {
        return response.data.profile;
      });
    },
    enabled: !!stellaId,
  });

  const handleRefetch = async () => {
    console.log("Invalidating and refetching story data");
    // Invalidate the cache and refetch
    await queryClient.invalidateQueries({ queryKey: ["story", storyId] });
  };

  // Show loading state
  if (isLoading || isProfileLoading) {
    return <div>Loading story...</div>;
  }

  // Show error state
  if (isError || isProfileError) {
    return (
      <div>Error loading story: {error?.message || profileError?.message}</div>
    );
  }
  console.log("Story component render:", { story, storyData, isLoading });

  return (
    <>
      <Bar className={style.topBar} variant="default">
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.story}>
        <PageCover
          key={`${storyId}-${story?.updatedAt || "initial"}`}
          onDelete={() => {
            navigate(`/${stellaId}`);
          }}
          onChange={handleRefetch}
          profileImageKey={profile?.profileImageKey}
          username={profile?.username}
          stellaId={stellaId}
          storyId={storyId}
          panels={story?.coverPage}
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
