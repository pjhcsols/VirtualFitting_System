import { createPreviewImage } from "@/pages/my";

export const handleImageFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (url: string) => void,
  setFile: (file: File) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const preview = createPreviewImage(file);
    setPreview(preview);
    setFile(file);
  }
};
