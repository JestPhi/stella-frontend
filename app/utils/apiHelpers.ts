import { auth } from "../config/firebase";

/**
 * Get Firebase token from current user
 */
export const getFirebaseToken = async (): Promise<string | undefined> => {
  const user = auth.currentUser;
  if (!user) return undefined;

  try {
    return await user.getIdToken();
  } catch (error) {
    console.error("Failed to get Firebase token:", error);
    return undefined;
  }
};

/**
 * Create standard headers for API requests
 */
export const createApiHeaders = (token?: string, isFormData = false) => {
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * Remove file attributes from data before sending to backend
 * This recursively cleans file objects from nested data structures
 */
export const sanitizeDataForBackend = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(sanitizeDataForBackend);
  }

  if (data && typeof data === "object") {
    const { file, placeholder, ...cleanData } = data;
    const result: any = {};

    for (const [key, value] of Object.entries(cleanData)) {
      result[key] = sanitizeDataForBackend(value);
    }

    return result;
  }

  return data;
};
