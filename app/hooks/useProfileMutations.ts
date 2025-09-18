import { profileAPI } from "../api/profiles";
import { createMutation, createQueryKeys } from "./useMutationFactory";

/**
 * Profile mutation hooks for React Query
 */

export const useProfileImageUpload = createMutation({
  mutationFn: ({
    stellaId,
    formData,
  }: {
    stellaId: string;
    formData: FormData;
  }) => profileAPI.uploadImage(stellaId, formData),
  invalidateQueries: (variables) => [
    createQueryKeys.profile(variables.stellaId).detail,
  ],
  errorMessage: "uploading profile image",
});

export const useProfileImageDelete = createMutation({
  mutationFn: (stellaId: string) => profileAPI.deleteImage(stellaId),
  invalidateQueries: (_, stellaId) => [
    createQueryKeys.profile(stellaId as string).detail,
  ],
  errorMessage: "deleting profile image",
});

export const useProfileBioUpdate = createMutation({
  mutationFn: ({ stellaId, bio }: { stellaId: string; bio: string }) =>
    profileAPI.updateBio(stellaId, bio),
  invalidateQueries: (variables) => [
    createQueryKeys.profile(variables.stellaId).detail,
  ],
  errorMessage: "updating profile bio",
});

export const useProfileUsernameUpdate = createMutation({
  mutationFn: ({
    stellaId,
    username,
  }: {
    stellaId: string;
    username: string;
  }) => profileAPI.updateUsername(stellaId, username),
  invalidateQueries: (variables) => [
    createQueryKeys.profile(variables.stellaId).detail,
  ],
  errorMessage: "updating profile username",
});

export const useProfileCreate = createMutation({
  mutationFn: ({
    firebaseId,
    username,
  }: {
    firebaseId: string;
    username: string;
  }) => profileAPI.createProfile(firebaseId, username),
  invalidateQueries: (_, data) => {
    // The response should contain the new stellaId
    if (data?.profile?.stellaId) {
      return [createQueryKeys.profile(data.profile.stellaId).detail];
    }
    return [];
  },
  errorMessage: "creating profile",
});
