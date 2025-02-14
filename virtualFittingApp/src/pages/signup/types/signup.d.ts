import { type USER_GRADE } from "../../../shared";

export type UserSignUpType = {
  userNumber: number;
  id: number;
  password: string;
  passwordCheck: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: USER_GRADE;
  loginType: string;
  userImageUrl: string;
  name: string;
  birthDate: string;
  zipCode: string;
  roadAddress: string;
  detailAddress: string;
};
