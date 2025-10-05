export type BrandUserType = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: TUserGrade;
  loginType: TLoginType;
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

export type BrandUserTypeKey = keyof BrandUserType;

export type BrandSigninUserType = {
  email: string;
  password: string;
};

export type RedisProductDto = {
  productName: string;
  productDesc: string;
  productPrice: number;
};

type TUserGrade = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

type TLoginType = "NORMAL";

export type TPhoneNumerPart = {
  prefix: string;
  middle: string;
  suffix: string;
};

export type TPhoneNumberKey = keyof TPhoneNumerPart;
