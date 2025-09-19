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

  return (
    <div className="story-container">
      <PageCover
        key={`${storyId}-${story?.updatedAt || "initial"}`}
        profileImageKey={profile?.profileImageKey}
        username={profile?.username}
        storyId={storyId as string}
        panels={story?.coverPage}
      />
      {Object.keys(story?.pages || {}).map((pageId: any, index) => {
        return (
          <Page
            key={pageId}
            pageId={pageId}
            panels={story?.pages?.[pageId].panels}
            pageNumber={index}
          />
        );
      })}
    </div>
  );
}
