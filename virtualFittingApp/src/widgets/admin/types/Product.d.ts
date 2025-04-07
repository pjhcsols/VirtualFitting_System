export type ProductDto = {
  product: Product;
  productSize: Size;
  productMaterial: Material;
  productColor: Color;
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
  productTotalLength: number;
  productChest: number;
  productShoulder: number;
  productArm: number;
};
