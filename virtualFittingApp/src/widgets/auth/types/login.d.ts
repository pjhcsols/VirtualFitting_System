export type LoginRequestDto = {
  userId: string;
  userPassword: string;
};

export type NormalUserSignUpRequestDto = {
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  name: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  address: string;
  totalLength: number;
  chest: number;
  shoulder: number;
  arm: number;
  pantsTotalLength: number;
  waistWidth: number;
  hipWidth: number;
  thighWidth: number;
  rise: number;
  hemWidth: number;
  height: number;
  weight: number;
};

export type BrandUserSignUpRequestDto = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: "BRONZE";
  loginType: string;
  userImageUrl: string;
  userProfileImageUrl: string;
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
  businessRegistrationCertificateImageUrl: string;
  firmWebUrl: string;
  firmEmail: string;
  firmPhone: string;
  saleAllowed: false;
};
