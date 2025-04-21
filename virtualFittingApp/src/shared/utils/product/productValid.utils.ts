import { SizeTable, type ProductCategory } from "@/shared/types";

export const isTitleLengthValid = (input: string): boolean => {
  return input.length <= 52;
};

export const isDescLengthValid = (input: string): boolean => {
  return input.length <= 63;
};

export const isNumberInRange = (input: number | string): boolean => {
  if (typeof input === "string") {
    const value = parseInt(input);
    return value >= 100 && value <= 100000000;
  } else {
    return input >= 100 && input <= 100000000;
  }
};

export const isFileCountValid = (files: (File | null)[] | null): boolean => {
  if (files === null) {
    return false;
  }
  return files.length >= 1 && files.length <= 5;
};

export const hasProductCategory = (categories: ProductCategory[]): boolean => {
  return categories.length > 0;
};

const isSizeTableValid = (table: SizeTable): boolean => {
  return (
    table.productSize !== undefined &&
    table.productTotalLength !== undefined &&
    table.productChest !== undefined &&
    table.productShoulder !== undefined &&
    table.productArm !== undefined
  );
};

export const isProductSizeTableValid = (array: SizeTable[]): boolean => {
  return array.length === 5 && array.every(isSizeTableValid);
};
