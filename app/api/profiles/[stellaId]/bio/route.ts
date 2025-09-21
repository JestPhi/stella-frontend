import { NextRequest } from "next/server";
import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const updateBio = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId"],
  // Ownership validation is now properly implemented with Firebase user ID checking
})(async (request: NextRequest, { params, body, token }) => {
  return await apiClient.patch(`/profiles/${params.stellaId}/bio`, body, token);
});

export { updateBio as PATCH };
