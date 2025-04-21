export type ServerProductDto = {};

export type ClientProductDto = {
  productName: string;
  productDescription: string;
  productPrice: number | string;
  productMainPhotos: (File | null)[] | null;
  productQuantity: number;
  productMaterial: Material;
  productColor: Color;
  productSubPhotos: File[] | null;
  productSizeTable: SizeTable[];
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

export type Size = "XX" | "S" | "M" | "L" | "XL" | "F";

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
