import { apiClient, createRoute, RouteTypes } from "../../utils/routeFactory";

const createProfile = createRoute({
  ...RouteTypes.PROFILE_CREATE,
  requireAuth: true, // Override to require auth but no ownership validation
  validateOwnership: false, // Can't validate ownership for new profiles
})(async (request, { body, token }) => {
  console.log("POST /api/profiles - body:", body);
  console.log("POST /api/profiles - token:", token ? "present" : "missing");

  const { firebaseId, username } = body;

  if (!firebaseId || !username) {
    throw new Error("firebaseId and username are required");
  }

  try {
    console.log(
      "POST /api/profiles - making request to:",
      `${process.env.STELLA_BACKEND_HOST || "http://localhost:3000"}/profiles`
    );
    console.log(
      "POST /api/profiles - payload:",
      JSON.stringify({ firebaseId, username })
    );
    console.log("POST /api/profiles - token length:", token?.length || 0);

    const result = await apiClient.post(
      "/profiles",
      { firebaseId, username },
      token
    );
    console.log("POST /api/profiles - success:", result);
    return result;
  } catch (error: any) {
    console.error("POST /api/profiles - error:", error.message);
    console.error("POST /api/profiles - error status:", error.response?.status);
    console.error("POST /api/profiles - error data:", error.response?.data);

    // Handle 409 conflict - profile already exists
    if (error.response?.status === 409) {
      console.log(
        "POST /api/profiles - profile exists, fetching existing profile by firebaseId"
      );
      try {
        // Fetch the existing profile by Firebase ID
        const existingProfile = await apiClient.get(
          `/profiles/firebase/${firebaseId}`,
          token
        );
        console.log(
          "POST /api/profiles - found existing profile:",
          existingProfile
        );
        return existingProfile;
      } catch (fetchError: any) {
        console.error(
          "POST /api/profiles - failed to fetch existing profile:",
          fetchError.message
        );
        // If we can't fetch the existing profile, throw the original 409 error
        throw error;
      }
    }

    throw error;
  }
});

export const POST = createProfile;
