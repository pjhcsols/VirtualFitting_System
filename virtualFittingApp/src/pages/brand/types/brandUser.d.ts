export type BrandUserType = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: string;
  loginType: strign;
  userImageUrl: string;
  userProfileImageUrl: string;
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
  businessRegistrationCertificateImageUrl: string;
  firmWebUrl: string;
  firmEmail: string;
  firmPhone: string;
  saleAllowed: boolean;
};

export type BrandSigninUserType = {
  email: string;
  password: string;
};

export type RedisProductDto = {
  productName: string;
  productDesc: string;
  productPrice: number;
};
