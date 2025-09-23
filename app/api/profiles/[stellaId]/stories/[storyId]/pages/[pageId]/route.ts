import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../../../../utils/routeFactory";

console.log("Page route file loaded");

const createPage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId"],
  timeout: 15000,
})(async (request, { params, token, body }) => {
  console.log("POST createPage called");
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
})(async (request, { params, token, body }) => {
  console.log("PATCH updatePage called");
  console.log("PATCH updatePage - params:", params);
  console.log("PATCH updatePage - updateData:", JSON.stringify(body, null, 2));
  console.log("PATCH updatePage - token exists:", !!token);

  try {
    const result = await apiClient.patch(
      `/profiles/${params.stellaId}/stories/${params.storyId}/pages/${params.pageId}`,
      body,
      token,
      15000
    );
    console.log("PATCH updatePage - success:", result);
    return result;
  } catch (error) {
    console.error("PATCH updatePage - error:", error);
    throw error;
  }
});

const deletePage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId", "storyId", "pageId"],
})(async (request, { params, token }) => {
  console.log("DELETE deletePage called");
  return await apiClient.delete(
    `/profiles/${params.stellaId}/stories/${params.storyId}/pages/${params.pageId}`,
    token
  );
});

export const POST = createPage;
export const PATCH = updatePage;
export const DELETE = deletePage;
