import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileAPI } from "../api/profiles";

/**
 * Profile mutation hooks for React Query
 */

export const useProfileImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      formData,
    }: {
      stellaId: string;
      formData: FormData;
    }) => profileAPI.uploadImage(stellaId, formData),
    onSuccess: (data, variables) => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.stellaId],
      });
    },
  });
};

export const useProfileImageDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stellaId: string) => profileAPI.deleteImage(stellaId),
    onSuccess: (data, stellaId) => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["profile", stellaId] });
    },
  });
};

export const useProfileBioUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stellaId, bio }: { stellaId: string; bio: string }) =>
      profileAPI.updateBio(stellaId, bio),
    onSuccess: (data, variables) => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.stellaId],
      });
    },
  });
};

export const useProfileUsernameUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      username,
    }: {
      stellaId: string;
      username: string;
    }) => profileAPI.updateUsername(stellaId, username),
    onSuccess: (data, variables) => {
      // Invalidate profile query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.stellaId],
      });
    },
  });
};
