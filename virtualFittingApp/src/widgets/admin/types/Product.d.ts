export type ServerProductDto = {};

export type ClientProductDto = {
  productName: string;
  productDescription: string;
  productPrice: number | string;
  productMainPhotos: FileList | null;
  productQuantity: number;
  productSize: Size;
  productMaterial: Material;
  productColor: Color;
  productSubPhotos: FileList | null;
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
  productTotalLength: number | string;
  productChest: number | string;
  productShoulder: number | string;
  productArm: number | string;
};
