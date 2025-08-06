import { v4 as uuidv4 } from "uuid";

import { CoverPageData, FileUpload } from "../types/story";

export const getFilesToUpload = (coverPageData: CoverPageData): FileUpload[] =>
  Object.entries(coverPageData)
    .filter(
      ([, element]) => element.type === "jpg" && element.value instanceof File
    )
    .map(([key, element]) => ({
      file: element.value as File,
      imageId: uuidv4(),
      elementKey: key,
    }));
