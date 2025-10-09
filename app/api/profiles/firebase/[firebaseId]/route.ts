import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const getProfileByFirebaseId = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["firebaseId"],
  cache: 0, // Disable caching
})(async (request, { params }) => {
  try {
    const data = await apiClient.get(`/profiles/firebase/${params.firebaseId}`);
    return data; // Return profile data directly
  } catch (error: any) {
    // Handle 404 specially - return null for consistency
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
});

export const GET = getProfileByFirebaseId;
