"use client";

import ProfileComponent from "@/components/Profile";
import Stories from "@/components/Stories";
import { useProfile } from "@/hooks/useProfile";
import { useUserStories } from "@/hooks/useStories";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const stellaId = params?.stellaId as string;

  // TanStack Query for fetching stories by stellaId via backend API
  const { data: storiesResponse } = useUserStories(stellaId, { limit: 50 });

  const stories = storiesResponse?.stories || [];

  // TanStack Query for fetching profile data via backend API
  const { data: profileResponse } = useProfile(stellaId);

  const profile = profileResponse;

  return (
    <div>
      <ProfileComponent />
      <Stories stories={stories} />
    </div>
  );
}
