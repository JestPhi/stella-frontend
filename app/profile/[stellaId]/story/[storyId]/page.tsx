"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Page from "../../../../components/Page";
import PageCover from "../../../../components/PageCover";
import { useProfile } from "../../../../hooks/useProfile";
import { useStory } from "../../../../hooks/useStories";

export default function StoryPage() {
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  // TanStack Query for fetching story data via backend API
  const {
    data: storyResponse,
    isLoading,
    isError,
    error,
  } = useStory(stellaId, storyId);

  const story = storyResponse?.story;

  // TanStack Query for fetching profile data via backend API
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useProfile(stellaId as string);

  const profile = profileResponse?.profile;

  const handleRefetch = async () => {
    console.log("Invalidating and refetching story data");
    // Invalidate the cache and refetch
    await queryClient.invalidateQueries({
      queryKey: ["story", stellaId, storyId],
    });
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

  return (
    <div className="story-container">
      <PageCover
        key={`${storyId}-${story?.updatedAt || "initial"}`}
        onDelete={() => {
          router.push(`/${stellaId}`);
        }}
        profileImageKey={profile?.profileImageKey}
        username={profile?.username}
        stellaId={stellaId as string}
        storyId={storyId as string}
        panels={story?.coverPage}
      />
      {story?.pages?.map((page: any) => {
        return <Page key={page.id} id={page.id} panels={page.panels} />;
      })}
    </div>
  );
}
