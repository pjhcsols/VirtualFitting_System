// * DTO
// * ============================================================
export type ServerProductDto = {
  productId: number;
  productName: string;
  productPrice: number;
  totalQuantity: number;
  categoryName: string[];
  productColors: string[];
  productPhotoUrls: string[];
};

export type ClientProductDto = {
  productId: number;
  status: ProductStatus;
  productCategory: ProductCategory;
  productName: string;
  productPrice: number;
  productMaterial: Material[];
  productDesc: string;
  totalQuantity: number;
  productOptions: ProductOptionType[];
  productSizeOptions: ProductSizeOptionType[];
  productColorOptions: productColorOptionType[];
  version: 0;
};

// * Static Value
// * ============================================================
type ProductStatus = "ON SALE" | "EXHIBITION_STOPPED";

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

export type ProductSizeTableType = {
  productSize: Size;
  productTotalLength: number | string;
  productChest: number | string;
  productShoulder: number | string;
  productArm: number | string;
};

// * Request DTO
// * ============================================================
export type ProductCategory = {
  categoryId: number;
  categoryName: string;
};

// * Product Option
// * ============================================================
type ProductOptionIdType = {
  productId: number;
  productSize: Size;
  productColor: Color;
};

type ProductOptionType = {
  id: ProductOptionIdType;
  product: string;
  // 해당 수량으로 TotalQuantity 로 들어간다.
  optionQuantity: number;
};

// * Product Size Table
// * ============================================================
type ProductSizeOptionIdType = {
  productId: number;
  productSize: Size;
};

export type ProductSizeOptionType = {
  id: ProductSizeIdType;
  product: String;
  totalLength: number;
  chest: number;
  shoulder: number;
  arm: number;
};

// * Product Color Option
// * ============================================================
type ProductColorOptionIdType = {
  productId: number;
  productColor: Color;
};

type productColorOptionType = {
  id: ProductColorOptionIdType;
  product: String;
  productPhotoUrls: string[];
  productSubPhotoUrls: string[];
};

// * ============================================================
export type BrandProductSimpleType = {
  productId: number;
  photoUrl?: string;
  productTitle: string;
  productPrice: string;
};
