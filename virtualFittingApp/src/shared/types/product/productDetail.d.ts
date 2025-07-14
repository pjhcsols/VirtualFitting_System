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
