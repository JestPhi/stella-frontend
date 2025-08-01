import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";

import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import ButtonAddStory from "../../components/ButtonAddStory";
import PageCover from "../../components/PageCover";
import style from "./style.module.css";
import ProfileComponent from "../../components/Profile";
import Logo from "../../components/Logo";
import { useGlobalContext } from "../../context/context";

const Profile = () => {
  const { state } = useGlobalContext();
  const navigate = useNavigate();
  const { stellaId } = useParams();

  // TanStack Query for fetching stories by stellaId
  const {
    data: stories = [],
    isLoading,
    isError,
    error,
    refetch,
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

  // TanStack Query to fetch profile data (CORRECT approach)
  const { data: profile } = useQuery({
    queryKey: ["profile", stellaId],
    queryFn: async () => {
      if (!stellaId) throw new Error("No stellaId provided");

      const response = await axios.get(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}`
      );
      console.log("Profile API response:", response.data);

      // Handle different possible response structures
      return response.data.profile || response.data;
    },
    enabled: !!stellaId, // Only run when stellaId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
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
        <ProfileComponent
          bio={profile.bio}
          username={profile.username}
          profileImageKey={profile.profileImageKey}
        />
        {stories.map((story: any) => {
          return (
            <PageCover
              username={profile.username}
              profileImageKey={profile.profileImageKey}
              onDelete={() => refetch()}
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

export default Profile;
