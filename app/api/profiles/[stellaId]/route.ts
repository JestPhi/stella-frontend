import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../utils/routeFactory";

const getProfile = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["stellaId"],
  cache: 600, // 10 minutes
})(async (request, { params }) => {
  const data = await apiClient.get(`/profiles/${params.stellaId}`);
  return { profile: data || null };
});

export const GET = getProfile;
