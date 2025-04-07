export const createPreviewImage = (file: File): string => {
    return URL.createObjectURL(file);
  };