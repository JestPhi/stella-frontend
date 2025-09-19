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

  return await apiClient.post("/profiles", { firebaseId, username }, token);
});

export const POST = createProfile;
