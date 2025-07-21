import PouchDb from "pouchdb-browser";
import { v4 as uuidv4 } from "uuid";
import storyData from "../scheme/story.json";

export const getStellaIdByFirebaseId = async (firebaseId: string) => {
  const db = new PouchDb("firebaseIds");

  try {
    const doc = await db.get(firebaseId);
    return doc;
  } catch (error) {
    return error;
  }
};

export const getUser = async () => {
  const db = new PouchDb("users");
  // try {
  //   const doc = db.get("userProfile");
  //   return doc;
  // } catch {}
};

export const createCoverPage = async (
  username: string,
  imageBlob: string,
  title: string
) => {
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

export const postFirebaseId = async (username: string, firebaseId: string) => {
  const db = await new PouchDb("firebaseIds");

  try {
    if (username && firebaseId) {
      const response = await db.post({
        _id: firebaseId,
        stellaId: uuidv4(),
      });
      return response;
    }
  } catch (error) {
    console.log("postUserId error");
    return error;
  }
};

export const postUsername = async (firebaseId: string, username: string) => {
  const firebaseIdDoc = await getStellaIdByFirebaseId(firebaseId);

  const db = await new PouchDb(firebaseIdDoc.stellaId);

  try {
    if (username) {
      const response = await db.post({
        _id: "profile",
        username: username,
      });
      return response;
    }
  } catch {
    console.log("postUsername error");
  }
};

export const getStory = async (profileId, storyId) => {
  const db = new PouchDb(profileId);
  const doc = db.get(storyId);

  return doc;
};

export const setStory = async () => {
  const db = new PouchDb("stellaId");
  return storyData;
};

export const getStories = async () => {
  const db = new PouchDb("stellaId");
  return storyData;
};

export const getProfile = async (stellaId: string) => {
  console.log(stellaId);
  const db = new PouchDb(stellaId);
  const doc = db.get("profile");
  return doc;
};
