export const moveItemUp = (array: any, index: number) => {
    const removedItem = array.splice(index, 1)[0]
    array.splice(index - 1, 0, removedItem)
}

export const moveItemDown = (array: any, index: number) => {
    const removedItem = array.splice(index, 1)[0]
    array.splice(index + 1, 0, removedItem)
}