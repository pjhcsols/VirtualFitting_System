import type React from 'react';

export const createPreviewImage = (file: File): string => {
  return URL.createObjectURL(file);
};

export const handleImageFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (url: string) => void,
  setFile: (file: File) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const previewUrl = createPreviewImage(file);
    setPreview(previewUrl);
    setFile(file);
  }
};