import axios from "axios";
import { waitForFirebaseToken } from "../hooks/useFirebaseToken";

export interface Profile {
  stellaId: string;
  username?: string;
  bio?: string;
  profileImageKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  profile: Profile | null;
}

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
   * Upload profile image
   */
  uploadImage: async (stellaId: string, formData: FormData): Promise<any> => {
    const token = await waitForFirebaseToken();
    const { data } = await axios.post(
      `/api/profiles/${stellaId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Delete profile image
   */
  deleteImage: async (stellaId: string): Promise<any> => {
    const token = await waitForFirebaseToken();
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
    const token = await waitForFirebaseToken();
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
    const token = await waitForFirebaseToken();
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
    const token = await waitForFirebaseToken();

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
