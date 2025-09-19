import { useQuery } from "@tanstack/react-query";
import { profileAPI } from "../api/profiles";

/**
 * Hook for fetching profile data by stellaId
 */
export function useProfile(stellaId: string) {
  return useQuery({
    queryKey: ["profile", stellaId],
    queryFn: () => profileAPI.getById(stellaId),
    enabled: !!stellaId,
    staleTime: 10 * 60 * 1000, // 10 minutes (profiles change less frequently)
    retry: 3,
  });
}

/**
 * Hook for fetching profile data by Firebase ID
 */
export function useProfileByFirebaseId(firebaseId: string) {
  return useQuery({
    queryKey: ["profile", "firebase", firebaseId],
    queryFn: () => profileAPI.getByFirebaseId(firebaseId),
    enabled: !!firebaseId,
    staleTime: 10 * 60 * 1000, // 10 minutes (profiles change less frequently)
    retry: 3,
  });
}
