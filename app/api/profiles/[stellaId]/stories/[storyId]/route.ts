import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../../utils/routeFactory";

const getStory = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["stellaId", "storyId"],
  cache: 120, // 2 minutes (stories are more dynamic)
})(async (request, { params }) => {
  const data = await apiClient.get(
    `/profiles/${params.stellaId}/stories/${params.storyId}`
  );
  return { story: data.story || null };
});

const updateStory = createRoute({
  requireAuth: true,
  rateLimit: { maxRequests: 20, windowMs: 60000 },
  timeout: 15000,
  params: ["stellaId", "storyId"],
})(async (request, { params, token, body }) => {
  return await apiClient.patch(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    body,
    token, // Pass token to backend
    15000
  );
});

const deleteStory = createRoute({
  requireAuth: true,
  rateLimit: { maxRequests: 20, windowMs: 60000 },
  params: ["stellaId", "storyId"],
})(async (request, { params, token }) => {
  return await apiClient.delete(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    token // Pass token to backend
  );
});

const createStory = createRoute({
  requireAuth: true,
  rateLimit: { maxRequests: 20, windowMs: 60000 },
  timeout: 15000,
  params: ["stellaId", "storyId"],
})(async (request, { params, token, body }) => {
  return await apiClient.post(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    body,
    token, // Pass token to backend
    15000
  );
});

export const GET = getStory;
export const PATCH = updateStory;
export const DELETE = deleteStory;
export const POST = createStory;
