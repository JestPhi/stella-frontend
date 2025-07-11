import PouchDb from "pouchdb-browser";
import storyData from "../scheme/story.json";

export const getUserByFirebaseId = async (firebaseId: string) => {
  const db = new PouchDb("users");

  try {
    const doc = await db.get(firebaseId);
    return doc;
  } catch {
    console.log("firebaseId not found");
  }
};

export const getUser = async () => {
  const db = new PouchDb("users");
  try {
    const doc = db.get("userProfile");
    return doc;
  } catch {}
};

export const setUser = async (username: string, firebaseId: string) => {
  const db = await new PouchDb("users");
  // user has db and user is not signed in
  try {
    if (username && firebaseId) {
      const response = await db.put(
        {
          _id: firebaseId,
          username: username,
        },
        { force: true }
      );
    }
  } catch {
    console.log("setUser error");
  }
};

export const getStory = async () => {
  const db = new PouchDb("storyId");
  return storyData;
};

export const setStory = async () => {
  const db = new PouchDb("storyId");
  return storyData;
};

export const getStories = async () => {
  const db = new PouchDb("userId");
  return storyData;
};
