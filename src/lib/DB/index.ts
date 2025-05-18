import PouchDB from 'pouchdb';
import find from 'pouchdb-find';

import storya from '../../scheme/story.json';
import { updated } from '$app/state';

PouchDB.plugin(find);

// TODO needs sever side ID generator to create user
export const createDB = async (user: any) => {
	const db = new PouchDB('test');
};

export const updateStory = async (story: any, userId: string, storyId: string) => {
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

export const createStory = async (story: any, userId: string) => {
	const db = new PouchDB(userId);
	try {
		const response = await db.post(story);
	} catch (error) {
		// User Id or Document not found
		console.log(error);
	}
};

export const findStory = async (userId: string, storyId: string) => {
	const db = new PouchDB(userId);

	try {
		const stories = await db.find({
			selector: { userId: userId, _id: storyId }
		});
		return stories;
	} catch (err) {
		console.log(err);
	}
};

export const findStories = async (user: string) => {
	const db = new PouchDB('test');

	try {
		const stories = await db.find({
			selector: { userId: 'test', type: 'story' }
		});
		console.log(stories);
		return stories;
	} catch (err) {
		console.log(err);
	}
};

export const updateStories = async (user: any, stories: any) => {
	const db = new PouchDB(user);
	try {
		const doc = await db.get(user);

		const updatedDocs = {
			...stories,
			_id: doc._id,
			_rev: doc._rev
		};

		db.put(updatedDocs);
	} catch (error) {
		console.log(error);
	}
};

export const createUpdateAuthor = async (author: any, user: any) => {
	const db = new PouchDB(user);
	try {
		const doc = await db.get(user);
		const updatedDocs = {
			...author,
			_id: doc._id,
			_rev: doc._rev
		};

		db.put(updatedDocs);
	} catch (error) {
		console.log(error);
	}
};

export const fetchAuthor = async (user: string, story: string) => {
	const db = new PouchDB(user);

	try {
		const doc = await db.get(story);
		return doc;
	} catch (err) {
		console.log(err);
	}
};
