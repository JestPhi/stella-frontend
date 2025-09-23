import { apiClient, createRoute, RouteTypes } from "../../utils/routeFactory";

const createProfile = createRoute({
  ...RouteTypes.PROFILE_CREATE,
  requireAuth: true, // Override to require auth but no ownership validation
  validateOwnership: false, // Can't validate ownership for new profiles
})(async (request, { body, token }) => {
  const { firebaseId, username } = body;

  if (!firebaseId || !username) {
    throw new Error("firebaseId and username are required");
  }

  try {
    const result = await apiClient.post(
      "/profiles",
      { firebaseId, username },
      token
    );
    return result;
  } catch (error: any) {
    // Handle 409 conflict - profile already exists
    if (error.response?.status === 409) {
      try {
        // Fetch the existing profile by Firebase ID
        const existingProfile = await apiClient.get(
          `/profiles/firebase/${firebaseId}`,
          token
        );
        return existingProfile;
      } catch (fetchError: any) {
        // If we can't fetch the existing profile, throw the original 409 error
        throw error;
      }
    }

    throw error;
  }
});

export const POST = createProfile;
