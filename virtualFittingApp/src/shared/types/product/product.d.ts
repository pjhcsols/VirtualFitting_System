export type ServerProductDto = {};

export type ClientProductDto = {
  productName: string;
  productDesc: string;
  productPrice: number | string;
  productMaterial: Material;
  productColor: Color;
  productMainPhotos: File[] | null;
  productSubPhotos: File[] | null;
  productSizeTable: SizeTable[] | "F";
  productOptions: productOptionType[];
  productColorOptions: productColorOptionType[];
  productCategory: ProductCategory;
};

export type Color =
  | "BLACK"
  | "WHITE"
  | "GRAY"
  | "BLUE"
  | "RED"
  | "YELLOW"
  | "GREEN"
  | "ORANGE";

export type Size = "XX" | "S" | "M" | "L" | "XL";

export type Material = "COTTON" | "POLYESTER" | "WOOL" | "FABRIC" | "SILK";

export type SizeTable = {
  productSize: Size;
  productTotalLength: number | string;
  productChest: number | string;
  productShoulder: number | string;
  productArm: number | string;
};

export type ProductCategory = {
  categoryId: number;
  categoryName: string;
};

type productOptionType = {
  productSize: Size;
  productColor: Color;
  optionQuantity: number;
};

type productColorOptionType = {
  productColor: Color;
  productPhotoUrls: string[];
  productSubPhotoUrls: string[];
};
