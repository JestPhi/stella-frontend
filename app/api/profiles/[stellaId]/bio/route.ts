import { NextRequest } from "next/server";
import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const updateBio = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId"],
})(async (request: NextRequest, { params, body, token }) => {
  return await apiClient.patch(`/profiles/${params.stellaId}/bio`, body, token);
});

export { updateBio as PATCH };
