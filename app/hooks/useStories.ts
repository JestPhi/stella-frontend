import { useQuery } from "@tanstack/react-query";
import { storiesAPI, StoriesParams } from "../api/stories";

/**
 * Hook for fetching all stories
 */
export function useStories(params: StoriesParams = {}) {
  return useQuery({
    queryKey: ["stories", params],
    queryFn: () => storiesAPI.getAll(params),
    staleTime: 15 * 60 * 1000, // Aggressive: 15 minutes
    retry: 3,
  });
}

/**
 * Hook for fetching stories by user stellaId
 */
export function useUserStories(stellaId: string, params: StoriesParams = {}) {
  return useQuery({
    queryKey: ["stories", stellaId, params],
    queryFn: () => storiesAPI.getByUser(stellaId, params),
    enabled: !!stellaId,
    staleTime: 15 * 60 * 1000, // Aggressive: 15 minutes
    retry: 3,
  });
}

/**
 * Hook for fetching individual story by stellaId and storyId
 */
export function useStory(stellaId: string, storyId: string) {
  return useQuery({
    queryKey: ["story", stellaId, storyId],
    queryFn: () => storiesAPI.getById(stellaId, storyId),
    enabled: !!stellaId && !!storyId,
    staleTime: 10 * 60 * 1000, // Aggressive: 10 minutes
    retry: 3,
  });
}
