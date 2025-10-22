"use client";

import Stories from "@/components/Stories";
import { useStories } from "@/hooks/useStories";

export default function Home() {
  const { data: storiesResponse } = useStories({ limit: 50 });

  const stories = storiesResponse?.stories || [];

  return <Stories stories={stories} />;
}
