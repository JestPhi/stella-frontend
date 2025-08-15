"use client";

import { useRouter } from "next/navigation";
import Stories from "./components/Stories";
import { useStories } from "./hooks/useStories";

// Inline styles to replace the imported CSS
const homeStyles = {
  stories: {
    padding: "8px",
  },
  story: {
    cursor: "pointer",
  },
  title: {
    padding: "8px 2px 8px 2px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    position: "sticky" as const,
    top: 0,
  },
  bottomBar: {
    bottom: 0,
    justifyContent: "space-between",
    position: "fixed" as const,
  },
};

export default function Home() {
  const router = useRouter();

  // TanStack Query for fetching all stories via backend API
  const {
    data: storiesResponse,
    isLoading,
    isError,
    error,
  } = useStories({ limit: 50 });

  const stories = storiesResponse?.stories || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="stories" style={homeStyles.stories}>
        <div>Loading stories...</div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="stories" style={homeStyles.stories}>
        <div>Error loading stories: {error?.message || "Unknown error"}</div>
      </div>
    );
  }

  return (
    <div className="stories">
      <Stories stories={stories} />
    </div>
  );
}
