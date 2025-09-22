export interface CoverPageElement {
  grid: { c: number; r: number; rs: number; cs: number };
  type: string;
  placeholder?: string;
  file?: File;
  value?: string;
  imageKey?: string;
}

export interface CoverPageData {
  [key: string]: CoverPageElement;
}

export interface FileUpload {
  file: File;
  imageKey: string;
  elementKey: string;
}
