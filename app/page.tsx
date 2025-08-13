"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Stories from "./components/Stories";

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

  // TanStack Query for fetching all stories
  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => {
      return axios(`${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/stories`).then(
        (response) => {
          return response.data.stories;
        }
      );
    },
  });

  return (
    <div className="stories">
      <Stories stories={stories} />
    </div>
  );
}
