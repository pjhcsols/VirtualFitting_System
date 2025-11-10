export type ProductColorFitting = "BLACK" | "WHITE" | "GRAY" | "BLUE" | "RED" | "YELLOW" | "GREEN" | "ORANGE";

export interface VirtualFittingRequestParams {
  authUserId: string;
  productId: number;
  color: ProductColorFitting;
  gender: string;
}

export interface VirtualFittingData {
  resultImageUrl: string;
  simulatedDelayMillis: number;
}

export interface VirtualFittingResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: VirtualFittingData;
}


export interface ProductBase {
  productId: number;
  productName: string;
  productPrice: number;
  categoryName: string;
  brandFirmName: string;
}

export interface Product extends ProductBase {
  totalQuantity: number;
  productColors: string[];
  productPhotoUrls: string[];
}

export interface ProductDetail extends Product {
  productDesc: string;
  productMaterials: string[];
  brandUser: {
    userNumber: number;
    id: string;
    emailAddress: string;
    phoneNumber: string;
    userGrade: string;
    loginType: string;
    firmName: string;
    firmAddress: string;
    businessRegistration: string;
    firmWebUrl: string;
  };
  productOptions: {
    productSize: string;
    productColor: string;
    optionQuantity: number;
  }[];
  productSizeOptions: {
    productSize: string;
    totalLength: number;
    chest: number;
    shoulder: number;
    arm: number;
  }[];
  productImages: {
    productColor: string;
    productPhotoUrls: string[];
    productSubPhotoUrls: string[];
  };
}

export interface ProductPrice {
  productId: number;
  baseUnitPrice: number;
  productDiscountPercent: number;
  productDiscountAmount: number;
  productDiscountedUnitPrice: number;
}

export type DiscountQuote = {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: {
    productId: number;
    brandName: string;
    baseUnitPrice: number;
    productDiscountPercent: number;
    productDiscountAmount: number;
    productDiscountedUnitPrice: number | null;
    userExtraPercent: number;
    userExtraDiscountAmount: number;
    finalUnitPrice: number;
  };
};
