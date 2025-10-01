import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../utils/routeFactory";

const uploadImage = createRoute({
  ...RouteTypes.IMAGE_UPLOAD,
  params: ["stellaId"],
})(async (request, { params, token, formData }) => {
  if (!formData) {
    throw new Error("No form data provided");
  }
  return await apiClient.post(
    `/profiles/${params.stellaId}/images`,
    formData,
    token,
    30000
  );
});

const deleteImage = createRoute({
  ...RouteTypes.PROTECTED_MODIFY,
  params: ["stellaId"],
})(async (request, { params, token }) => {
  return await apiClient.delete(`/profiles/${params.stellaId}/images`, token);
});

export const POST = uploadImage;
export const DELETE = deleteImage;
