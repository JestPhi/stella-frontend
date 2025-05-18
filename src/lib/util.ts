export const isBlob = (obj: any) => {
	return obj instanceof Blob;
};

export const moveItemUp = (array: any, index: number) => {
	const removedItem = array.splice(index, 1)[0];
	array.splice(index - 1, 0, removedItem);
};

export const moveItemDown = (array: any, index: number) => {
	const removedItem = array.splice(index, 1)[0];
	array.splice(index + 1, 0, removedItem);
};

export const removeItem = (array: any, index: number) => {
	array.splice(index, 1);
};
