import type { ColorType, MaterialType, SizeType } from "@/shared";

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

export type useProductReturnType = {
  productName: {
    name: "productName";
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productPrice: {
    name: "productPrice";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productCategory: {
    name: "productCategory";
    value: { categoryId: number; categoryName: string };
    onChange: ({ key, value }: { key: number; value: string }) => void;
  };
  productTotalLength: {
    name: "productTotalLength";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productChest: {
    name: "productChest";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productShoulder: {
    name: "productShoulder";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productArm: {
    name: "productArm";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productDesc: {
    name: "productDesc";
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
  productColor: {
    name: "productColor";
    value: ColorType[];
    onChange: (values: ColorType[]) => void;
  };
  productMaterial: {
    name: "productMaterial";
    value: MaterialType[];
    onChange: (values: MaterialType[]) => void;
  };
  productSize: {
    name: "productSize";
    value: SizeType[];
    onChange: (values: SizeType[]) => void;
  };
  productPhotoUrl: {
    name: "productPhotoUrl";
    value: string[];
    thumbNail: string | ArrayBuffer | null;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDelete: (name: "productPhotoUrl" | "productSubPhotoUrl") => void;
  };
  productSubPhotoUrl: {
    name: "productSubPhotoUrl";
    value: string[];
    thumbNail: (string | ArrayBuffer)[] | null;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDelete: (name: "productPhotoUrl" | "productSubPhotoUrl") => void;
  };
  totalQuantity: {
    name: "totalQuantity";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  };
};
