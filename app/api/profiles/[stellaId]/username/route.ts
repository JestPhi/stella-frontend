import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const updateUsername = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId"],
})(async (request, { params, body, token }) => {
  return await apiClient.patch(
    `/profiles/${params.stellaId}/username`,
    body,
    token
  );
});

export const PATCH = updateUsername;
