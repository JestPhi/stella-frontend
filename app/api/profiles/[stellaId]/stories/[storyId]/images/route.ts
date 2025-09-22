import { apiClient, createRoute } from "../../../../../../utils/routeFactory";

const uploadStoryImage = createRoute({
  requireAuth: true,
  rateLimit: { maxRequests: 20, windowMs: 60000 },
  timeout: 30000,
  params: ["stellaId", "storyId"],
})(async (request, { params, token, formData }) => {
  console.log(`[${new Date().toISOString()}] Story image upload attempt:`, {
    stellaId: params.stellaId,
    storyId: params.storyId,
    hasFormData: !!formData,
    formDataKeys: formData ? Array.from(formData.keys()) : [],
    contentType: request.headers.get("content-type"),
  });

  if (!formData) {
    console.error("No form data provided");
    throw new Error("No form data provided");
  }

  try {
    const backendUrl = `/profiles/${params.stellaId}/stories/${params.storyId}/images`;
    console.log(`Making request to backend: ${backendUrl}`);

    const result = await apiClient.post(
      backendUrl,
      formData,
      token, // Pass token to backend
      30000 // 30 second timeout
    );

    console.log("Backend response successful:", {
      status: "success",
      hasData: !!result,
    });
    return result;
  } catch (error: any) {
    console.error("Story image upload failed:", {
      stellaId: params.stellaId,
      storyId: params.storyId,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code,
      isAxiosError: error.isAxiosError,
    });

    throw error;
  }
});

export const POST = uploadStoryImage;
