import {
  apiClient,
  createRoute,
  RouteTypes,
  ValidationSchemas,
} from "../../utils/routeFactory";

const getStories = createRoute(RouteTypes.PUBLIC_READ)(
  async (request, { query }) => {
    const { page, limit } = ValidationSchemas.pagination(query);

    const data = await apiClient.get(`/stories?page=${page}&limit=${limit}`);

    return {
      stories: data.stories || [],
      pagination: data.pagination || null,
    };
  }
);

export const GET = getStories;
