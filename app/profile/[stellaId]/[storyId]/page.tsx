"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { storyAPI } from "../../../../src/api/story";
import axios from "axios";
import Bar from "../../../../src/components/Bar";
import Button from "../../../../src/components/Button";
import ButtonBack from "../../../../src/components/ButtonBack";
import ButtonMenu from "../../../../src/components/ButtonProfile";
import ButtonAddPage from "../../../../src/components/ButtonAddPage";
import PageCover from "../../../../src/components/PageCover";
import Menu from "../../../../src/components/Menu";
import Logo from "../../../../src/components/Logo";
import { useGlobalContext } from "../../../../src/context/context";

// Inline styles to replace the imported CSS
const storyStyles = {
  story: {
    height: "calc(100dvh - 44px)",
    overflowX: "scroll" as const,
    scrollSnapType: "y mandatory",
    scrollbarWidth: "none" as const,
  },
  bottomBar: {
    justifyContent: "space-between",
  },
  topBar: {
    justifyContent: "space-between",
  },
};

export default function StoryPage() {
  const { stellaId, storyId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { state } = useGlobalContext();

  // TanStack Query for fetching story data
  const {
    data: storyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyAPI.getById(storyId as string),
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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profile/${stellaId}`
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
    <div className="story-container">
      <PageCover
        key={`${storyId}-${story?.updatedAt || "initial"}`}
        onDelete={() => {
          router.push(`/${stellaId}`);
        }}
        onChange={handleRefetch}
        profileImageKey={profile?.profileImageKey}
        username={profile?.username}
        stellaId={stellaId as string}
        storyId={storyId as string}
        panels={story?.coverPage}
      />
    </div>
  );
}
