"use client";

import { useParams } from "next/navigation";
import { useProfile } from "../../hooks/useProfile";
import { useUserStories } from "../../hooks/useStories";

import ProfileComponent from "../../components/Profile";
import Stories from "../../components/Stories";

// Inline styles to replace the imported CSS
const profileStyles = {
  stories: {
    alignTracks: "end",
    height: "100vh",
    overflowY: "scroll" as const,
    scrollSnapType: "y mandatory",
    scrollbarWidth: "none" as const,
  },
  topBar: {
    justifyContent: "space-between",
    position: "sticky" as const,
    top: 0,
  },
  bottomBar: {
    justifyContent: "space-between",
    position: "fixed" as const,
    bottom: 0,
  },
};

export default function ProfilePage() {
  const params = useParams();
  const stellaId = params?.stellaId as string;

  // TanStack Query for fetching stories by stellaId via backend API
  const {
    data: storiesResponse,
    isLoading,
    isError,
    error,
  } = useUserStories(stellaId, { limit: 50 });

  const stories = storiesResponse?.stories || [];

  // TanStack Query for fetching profile data via backend API
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useProfile(stellaId);

  const profile = profileResponse;

  return (
    <>
      <div className="profile">
        <ProfileComponent />
        <Stories stories={stories} />
      </div>
    </>
  );
}
