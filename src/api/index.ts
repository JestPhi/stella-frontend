import PouchDb from "pouchdb-browser";
import { v4 as uuidv4 } from "uuid";
import storyData from "../scheme/story.json";

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
    firebaseId: firebaseId,
    imageBlob: imageBlob,
    username: username,
    stellaId: stellaId,
  });

  return stellaProfileDoc;
};

export const updateProfile = async ({
  bio,
  imageBlob,
  stellaId,
  username,
}: UpdateProfileParams): Promise<any> => {
  if (!username || !stellaId) {
    console.log("setProfile Error", stellaId, username);
    return;
  }
  debugger;
  if (imageBlob) {
    const a = await uploadImageBlob(imageBlob);
    console.log(a);
    debugger;
  }

  try {
    const db = new PouchDb(stellaId);
    const doc = await db.get("profile");
    const response = await db.put(
      {
        _id: "profile",
        _rev: doc._rev,
        bio: bio,
        imageBlob: imageBlob,
        username: username,
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
  const db = new PouchDb(stellaId);
  try {
    const doc = await db.get("profile");
    return doc as ProfileDoc;
  } catch (error) {
    return error as Error;
  }
};

export const createCoverPage = async (
  username: string,
  imageBlob: string,
  title: string
): Promise<any> => {
  const db = new PouchDb("stellaId");
  try {
    if (!!username) {
      const response = await db.post({
        coverPage: {
          imageBlob: imageBlob,
          title: title,
        },
      });
      return response;
    }
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

export const getStories = async (): Promise<any> => {
  const db = new PouchDb("stellaId");
  return storyData;
};

export const uploadImageBlob = async (imageBlob: string): Promise<any> => {
  try {
    // Convert base64 string to blob
    const base64Data = imageBlob.split(",")[1]; // Remove data:image/...;base64, prefix
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

    const response = await fetch("http://localhost:3000/upload-image", {
      method: "POST",
      body: formData, // Send as FormData (multipart/form-data)
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

// stella/stellaId/profile/Image
// stella/stellaId/story/grid/Image
