import {
  apiClient,
  createRoute,
  RouteTypes,
  ValidationSchemas,
} from "../../../../utils/routeFactory";

const getUserStories = createRoute({
  ...RouteTypes.PUBLIC_READ,
  params: ["stellaId"],
})(async (request, { params, query }) => {
  const { page, limit } = ValidationSchemas.pagination(query);

  const data = await apiClient.get(
    `/profiles/${params.stellaId}/stories?page=${page}&limit=${limit}`
  );

  return {
    stories: data.stories || [],
    pagination: data.pagination || null,
  };
});

export const GET = getUserStories;
