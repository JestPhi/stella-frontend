import {
  apiClient,
  createRoute,
  RouteTypes,
} from "../../../../../../utils/routeFactory";

const uploadStoryImage = createRoute({
  ...RouteTypes.IMAGE_UPLOAD,
  params: ["stellaId", "storyId"],
})(async (request, { params, token }) => {
  const formData = await request.formData();
  return await apiClient.post(
    `/profiles/${params.stellaId}/stories/${params.storyId}/images`,
    formData,
    token,
    30000
  );
});

export const POST = uploadStoryImage;
