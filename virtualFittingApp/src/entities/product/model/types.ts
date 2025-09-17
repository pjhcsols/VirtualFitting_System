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

export type ProductDetail = {
  productId: number;
  productName: string;
  productPrice: number;
  productDesc: string;
  productMaterials: string[];
  categoryName: string;
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
  totalQuantity: number;
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
};

export interface ProductPrice {
  productId: number;
  baseUnitPrice: number;
  productDiscountPercent: number;
  productDiscountAmount: number;
  productDiscountedUnitPrice: number;
}

export type Product = {
  productId: number;
  productName: string;
  productPrice: number;
  totalQuantity: number;
  categoryName: string;
  productColors: string[];
  productPhotoUrls: string[];
}