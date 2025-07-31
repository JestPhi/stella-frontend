import PouchDb from "pouchdb-browser";
import { v4 as uuidv4 } from "uuid";
import storyData from "../scheme/story.json";
import { convertToBase64 } from "../utils";

// Types
export type FirebaseIdDoc = {
  _id: string;
  stellaId: string;
};

export type ProfileDoc = {
  _id: string;
  _rev?: string;
  bio?: string;
  imageBlob?: string;
  profileImageURL?: string;
  username: string;
  stellaId?: string;
};

export type CreateProfileParams = {
  firebaseId?: string;
  imageBlob?: string;
  username?: string;
  stellaId?: string;
};

export type UpdateProfileParams = {
  bio?: string;
  imageBlob?: string;
  profileImageURL?: string;
  stellaId?: string;
  username?: string;
};

export const getProfileByFirebaseId = async (
  firebaseId?: string
): Promise<ProfileDoc | Error> => {
  if (!firebaseId) {
    console.log("getProfileByFirebaseId missing firebaseId");
    return new Error();
  }

  const db = new PouchDb("firebaseIds");
  let firebaseIdDoc: FirebaseIdDoc;
  try {
    firebaseIdDoc = (await db.get(firebaseId)) as FirebaseIdDoc;
  } catch (error) {
    return error as Error;
  }

  const profileDoc = await getProfile(firebaseIdDoc.stellaId);

  try {
    return {
      stellaId: firebaseIdDoc.stellaId,
      ...profileDoc,
    };
  } catch (error) {
    return error as Error;
  }
};

export const createStellaProfile = async ({
  imageBlob,
  username,
  stellaId,
}: CreateProfileParams): Promise<any> => {
  if (!username || !stellaId) {
    console.log("setProfile Error");
    return;
  }

  const db = new PouchDb(stellaId);

  try {
    const response = await db.post({
      _id: "profile",
      imageBlob: imageBlob,
      username: username,
      stellaId: stellaId,
      type: "profile",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createProfile = async ({
  imageBlob,
  username,
  firebaseId,
}: CreateProfileParams): Promise<FirebaseIdDoc | Error> => {
  if (!username || !firebaseId) {
    return new Error("Missing username or firebaseId");
  }

  const stellaId = uuidv4();
  const db = new PouchDb("firebaseIds");

  await db.post({
    _id: firebaseId,
    stellaId: stellaId,
  });

  const stellaProfileDoc = await createStellaProfile({
    created: Date.now(),
    firebaseId: firebaseId,
    imageBlob: imageBlob,
    username: username,
    stellaId: stellaId,
  });

  return stellaProfileDoc;
};

export const updateProfile = async ({
  bio,
  stellaId,
  username,
}: UpdateProfileParams): Promise<any> => {
  if (!username || !stellaId) {
    console.log("setProfile Error", stellaId, username);
    return;
  }

  try {
    const db = new PouchDb(stellaId);
    const doc = await db.get("profile");
    const response = await db.put(
      {
        ...doc,
        bio: bio,
        username: username,
        stellaId: stellaId,
        updated: Date.now(),
      },
      { force: true }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (
  stellaId: string
): Promise<ProfileDoc | Error> => {
  try {
    const db = new PouchDb(stellaId);
    const doc = await db.get("profile");

    return doc as ProfileDoc;
  } catch (error) {
    return error as Error;
  }
};

export const deleteAvatar = async (stellaId: string, key: string) => {
  try {
    // First delete the image from storage
    await deleteObject(key);
    console.log("Image deleted successfully");

    const db = new PouchDb(stellaId);
    const doc = await db.get("profile");
    const response = await db.put(
      {
        ...doc,
        profileImageURL: null,
      },
      { force: true }
    );
    return response;
  } catch (error) {
    console.error("Failed to delete avatar:", error);
  }
};

export const updateAvatar = async (stellaId: string, imageBlob: string) => {
  try {
    // First upload the new image
    const imageResponse = await uploadImageBlob({
      imageBlob,
      folder: `${stellaId}/profile`,
    });

    if (!imageResponse?.fileName) {
      throw new Error("Failed to upload image - no filename returned");
    }

    console.log("Image uploaded successfully:", imageResponse.fileName);

    // Then update the profile with the new image URL
    const db = new PouchDb(stellaId);
    const doc = await db.get("profile");
    const response = await db.put(
      {
        ...doc,
        profileImageURL: imageResponse.fileName,
        updated: Date.now(),
      },
      { force: true }
    );
    return response;

    console.log("Profile updated with new avatar");
  } catch (error) {
    console.error("Failed to update avatar:", error);
    // Could add user-facing error handling here (e.g., toast notification)
  }
};

export const createCoverPage = async (
  stellaId: string,
  coverPage: any
): Promise<any> => {
  const db = new PouchDb(stellaId);
  const newStoryId = uuidv4();

  try {
    if (!stellaId) {
      return;
    }

    const response = await uploadImageBlob({
      imageBlob: coverPage["0"].value,
      folder: `${stellaId}/stories/${newStoryId}`,
    });

    const doc = await db.post({
      _id: newStoryId,
      created: Date.now(),
      coverPage: {
        ...coverPage,
        "0": {
          ...coverPage["0"],
          value: `${stellaId}/stories/${newStoryId}/${response.fileName}`,
        },
      },
    });

    return doc;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getStory = async (
  profileId: string,
  storyId: string
): Promise<any> => {
  const db = new PouchDb(profileId);
  try {
    const doc = await db.get(storyId);
    return doc;
  } catch (error) {
    return error;
  }
};

export const setStory = async (): Promise<any> => {
  const db = new PouchDb("stellaId");
  return storyData;
};

export const getStories = async (stellaId: string): Promise<any> => {
  const db = new PouchDb(stellaId);
  const docs = await db.allDocs({ include_docs: true });

  return docs.rows
    .filter((row) => {
      return row?.doc?.type === "story";
    })
    .map((row) => {
      return {
        coverImageURL: row.doc.coverImageURL,
        id: row.doc._id,
        title: row.doc.title,
      };
    });
};

export const deleteObject = async (key: string) => {
  const response = await fetch(
    `http://localhost:3000/delete-object?key=${key}`,
    {
      method: "DELETE",
    }
  );
};

export type UploadImageBlobParams = {
  imageBlob: string;
  folder: string;
};

export const uploadImageBlob = async ({
  imageBlob,
  folder,
}: UploadImageBlobParams): Promise<any> => {
  try {
    const base64String = await convertToBase64(imageBlob);
    // Convert base64 string to blob
    const base64Data = base64String.split(",")[1]; // Remove data:image/...;base64, prefix
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    // Create FormData to send as file
    const formData = new FormData();
    formData.append("image", blob, "image.jpg");
    formData.append("folder", folder);

    //TODO use env endpoint
    const response = await fetch("http://localhost:3000/upload-image", {
      method: "POST",
      body: formData, // Send FormData directly, not JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
