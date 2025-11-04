export type NormalUserType = {
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  name: string;
  nickname: string;
  gender: GenderType;
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

type GenderType = "MALE" | "FEMALE";

export type BrandUserType = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: UserGrade;
  loginType: string;
  userImageUrl: string;
  userProfileImageUrl: string;
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
  businessRegistrationCertificateImageUrl: string | null;
  firmWebUrl: string;
  firmEmail: string;
  firmPhone: string;
  saleAllowed: boolean;
};

export type RegistrationType = {
  username: string;
  certificateImageUrl: string | null;
};

type UserGrade = "BRONZE";
