import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const getProfileByFirebaseId = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["firebaseId"],
})(async (request, { params }) => {
  try {
    const data = await apiClient.get(`/profiles/firebase/${params.firebaseId}`);
    return data;
  } catch (error: any) {
    // Handle 404 specially - return null profile instead of error
    if (error.response?.status === 404) {
      return { profile: null };
    }
    throw error;
  }
});

export const GET = getProfileByFirebaseId;
