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
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId"],
  timeout: 15000,
})(async (request, { params, token }) => {
  const body = await request.json();
  return await apiClient.patch(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    body,
    token,
    15000
  );
});

const deleteStory = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId"],
})(async (request, { params, token }) => {
  return await apiClient.delete(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    token
  );
});

const createStory = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId"],
  timeout: 15000,
})(async (request, { params, token }) => {
  const body = await request.json();
  return await apiClient.post(
    `/profiles/${params.stellaId}/stories/${params.storyId}`,
    body,
    token,
    15000
  );
});

export const GET = getStory;
export const PATCH = updateStory;
export const DELETE = deleteStory;
export const POST = createStory;
