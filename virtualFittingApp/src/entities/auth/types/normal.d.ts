export type GenderType = "MALE" | "FEMALE" | "OTHER";

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

export type NormalUserTypeKey = keyof NormalUserType;
