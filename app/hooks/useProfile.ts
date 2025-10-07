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
    staleTime: 20 * 60 * 1000, // Aggressive: 20 minutes (profiles rarely change)
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
    staleTime: 20 * 60 * 1000, // Aggressive: 20 minutes (profiles rarely change)
    retry: 3,
  });
}
