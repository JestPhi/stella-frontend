import PouchDB from 'pouchdb';
import storya from '../../scheme/story.json';

// TODO needs sever side ID generator to create user
export const createDB = async (user: any) => {
	const db = new PouchDB('test');
};

export const createUpdateStory = async (story: any, userId: string, storyId: string) => {
	// TODO needs json schema
	const db = new PouchDB(userId);

	try {
		const doc = await db.get(storyId);

		const updatedDoc = {
			...story,
			_id: doc._id,
			_rev: doc._rev
		};

		db.put(updatedDoc);
	} catch (error) {
		// User Id or Document not found
		console.log(error);
	}
};

export const fetchStory = async (user: string, story: string) => {
	const db = new PouchDB(user);

	try {
		const doc = await db.get(story);
		return doc;
	} catch (err) {
		console.log(err);
	}
};
