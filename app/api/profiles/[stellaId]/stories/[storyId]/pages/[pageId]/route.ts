import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../../../../utils/routeFactory";

const createPage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId"],
  timeout: 15000,
})(async (request, { params, token }) => {
  const body = await request.json();
  return await apiClient.post(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages`,
    body,
    token,
    15000
  );
});

const updatePage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId", "pageId"],
  timeout: 15000,
})(async (request, { params, token }) => {
  const updateData = await request.json();
  return await apiClient.patch(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages/${params.pageId}`,
    updateData,
    token,
    15000
  );
});

const deletePage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId", "pageId"],
})(async (request, { params, token }) => {
  return await apiClient.delete(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages/${params.pageId}`,
    token
  );
});

export const POST = createPage;
export const PATCH = updatePage;
export const DELETE = deletePage;
