export type FileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: "ready" | "uploading" | "success" | "error";
};
