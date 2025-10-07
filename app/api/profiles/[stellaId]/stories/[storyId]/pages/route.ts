import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../../../utils/routeFactory";

const createPage = createRoute({
  requireAuth: true,
  rateLimit: { maxRequests: 2000, windowMs: 60000 },
  timeout: 15000,
  params: ["stellaId", "storyId"],
})(async (request, { params, token, body }) => {
  return await apiClient.post(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages`,
    body,
    token,
    15000
  );
});

const getPages = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["stellaId", "storyId"],
  cache: 120,
})(async (request, { params }) => {
  const data = await apiClient.get(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages`
  );
  return { pages: data.pages || [] };
});

export const POST = createPage;
export const GET = getPages;
