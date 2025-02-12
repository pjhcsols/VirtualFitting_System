export type ProductInputType = {
  // ID 자동 생성
  productId: number;

  // 상품명
  productName: string;

  // 상품 가격
  productPrice: string;

  productTotalLength: number; // 총장
  productChest: number; // 가슴 둘레
  productShoulder: number; // 어깨 길이
  productArm: number; // 팔 길이

  productDesc: string; // 상품 설명

  productCategory: ProductCategoryType; // 상품 카테고리
  productMaterial: MaterialType[]; // 소재

  productSize: SizeType[]; // 사이즈 타입

  productColor: ColorType[]; // 색상

  productPhotoUrl: string[];
  productSubPhotoUrl: string[];

  totalQuantity: number; // 총 수량
};

export type ProductCategoryType = {
  categoryId: number;
  categoryName: string;
};
