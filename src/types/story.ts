export interface CoverPageElement {
  grid: { c: number; r: number; rs: number; cs: number };
  type: string;
  placeholder?: string;
  value?: string | File;
  imageKey?: string;
}

export interface CoverPageData {
  [key: string]: CoverPageElement;
}

export interface FileUpload {
  file: File;
  imageId: string;
  elementKey: string;
}
