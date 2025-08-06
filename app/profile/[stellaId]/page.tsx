"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import ProfileComponent from "../../components/Profile";

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
  const stellaId = params.stellaId as string;

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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/stories/${stellaId}`
      ).then((response) => {
        return response.data.stories;
      });
    },
    enabled: !!stellaId,
  });

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

  useEffect(() => {
    console.log(stories);
  }, [stories]);

  // Show loading state
  if (isLoading || isProfileLoading) {
    return <div>Loading profile...</div>;
  }

  // Show error state
  if (isError || isProfileError) {
    return (
      <div>
        Error loading profile: {error?.message || profileError?.message}
      </div>
    );
  }

  return (
    <>
      <div className="profile">
        <ProfileComponent
          profileImageKey={profile.profileImageKey}
          bio={profile.bio}
          username={profile.username}
        />
      </div>
    </>
  );
}
