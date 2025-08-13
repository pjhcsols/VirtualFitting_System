export type BrandUserType = {
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
  firmWebUrl: string;
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

export interface BrandAuthenticationType {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: BrandAuthenticationDataType;
}

type BrandAuthenticationDataType = {
  userNumber: number;
  busniessRegistration: string;
  fileName: string;
  url: string;
};
