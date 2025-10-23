import axios from "axios";
import { createApiHeaders, getFirebaseToken } from "../utils/apiHelpers";

export interface Profile {
  stellaId: string;
  username?: string;
  bio?: string;
  profileImageKey?: string;
  firebaseId?: string;
  createdAt?: string;
  updatedAt?: string;
  success?: boolean;
}

// The API returns { profile: Profile | null }
export type ProfileResponse = {
  profile: Profile | null;
};

export interface UpdateBioRequest {
  bio: string;
}

export interface UpdateUsernameRequest {
  username: string;
}

/**
 * Profile API service for backend requests
 */
export const profileAPI = {
  /**
   * Fetch profile by stellaId
   */
  getById: async (stellaId: string): Promise<ProfileResponse> => {
    const { data } = await axios.get(`/api/profiles/${stellaId}`);
    return data;
  },

  /**
   * Fetch profile by Firebase ID
   */
  getByFirebaseId: async (firebaseId: string): Promise<ProfileResponse> => {
    const { data } = await axios.get(`/api/profiles/firebase/${firebaseId}`);

    return data;
  },

  /**
   * Upload profile image
   */
  uploadImage: async (stellaId: string, formData: FormData): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.post(
      `/api/profiles/${stellaId}/images`,
      formData,
      {
        headers: createApiHeaders(token, true), // true for FormData
      }
    );
    return data;
  },

  /**
   * Delete profile image
   */
  deleteImage: async (stellaId: string): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.delete(`/api/profiles/${stellaId}/images`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  /**
   * Update profile bio
   */
  updateBio: async (stellaId: string, bio: string): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.patch(
      `/api/profiles/${stellaId}/bio`,
      {
        bio,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Update profile username
   */
  updateUsername: async (stellaId: string, username: string): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.patch(
      `/api/profiles/${stellaId}/username`,
      {
        username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Create profile with username using firebaseId
   */
  createProfile: async (firebaseId: string, username: string): Promise<any> => {
    // Get Firebase token for authentication
    const token = await getFirebaseToken();

    const { data } = await axios.post(
      `/api/profiles`,
      {
        firebaseId,
        username,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};
