import { v4 as uuidv4 } from "uuid";

import { CoverPageData, FileUpload } from "../types/story";

export const getFilesToUpload = (
  coverPageData: CoverPageData
): FileUpload[] => {


  return Object.entries(coverPageData)
    .filter(
      ([, element]) => element.type === "jpg" && element.file instanceof File
    )
    .map(([key, element]) => ({
      file: element.file as File,
      imageKey: uuidv4(),
      elementKey: key,
    }));
};
