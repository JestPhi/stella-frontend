import PouchDb from "pouchdb-browser";
import storyData from "../scheme/story.json";

export const getUserByFirebaseId = async (firebaseId: string) => {
  const db = new PouchDb("firebaseIds");
  try {
    const doc = await db.get(firebaseId);
    return doc;
  } catch {
    console.log("firebaseId not found");
  }
};

export const getUser = async () => {
  const db = new PouchDb("testUser");
  try {
    const doc = db.get("userProfile");
    return doc;
  } catch {}
};

export const setUser = async (user: any) => {
  const db = await new PouchDb("testUser");

  // user has db and user is not signed in
  try {
    const doc = await db.get("userProfile");

    if (!user && doc._rev) {
      db.put(
        {
          _id: "userProfile",
          _rev: doc._rev,
        },
        { force: true }
      );
    }

    if (user && doc._rev) {
      const updatedDoc = {
        ...userData,
        _id: "userProfile",
        _rev: doc._rev,
      };

      db.put(updatedDoc, { force: true });
    }
  } catch {
    db.put(
      {
        _id: "userProfile",
      },
      { force: true }
    );
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
