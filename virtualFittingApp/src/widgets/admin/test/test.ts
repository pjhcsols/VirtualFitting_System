import { BasiliumResponse } from "@/shared";

interface BrandApplicants extends BasiliumResponse {
  data: BrandApplicantsDataType[];
}

type BrandApplicantsDataType = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: "BRONZE";
  loginType: "NORMAL";
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

export const testFile: BrandApplicants = {
  status: 200,
  timestamp: "",
  code: "",
  message: "",
  data: [
    {
      userNumber: 0,
      id: "sunja1742",
      password: "test",
      emailAddress: "sunja1472@gmail.com",
      phoneNumber: "090-6314-8807",
      userGrade: "BRONZE",
      loginType: "NORMAL",
      userImageUrl: "",
      userProfileImageUrl: "",
      firmName: "",
      firmAddress: "",
      businessRegistration: "",
      businessRegistrationCertificateImageUrl: "",
      firmWebUrl: "",
      firmEmail: "",
      firmPhone: "",
      saleAllowed: false,
    },
    {
      userNumber: 0,
      id: "sunja1742",
      password: "test",
      emailAddress: "sunja1472@gmail.com",
      phoneNumber: "090-6314-8807",
      userGrade: "BRONZE",
      loginType: "NORMAL",
      userImageUrl: "",
      userProfileImageUrl: "",
      firmName: "",
      firmAddress: "",
      businessRegistration: "",
      businessRegistrationCertificateImageUrl: "",
      firmWebUrl: "",
      firmEmail: "",
      firmPhone: "",
      saleAllowed: false,
    },
    {
      userNumber: 0,
      id: "sunja1742",
      password: "test",
      emailAddress: "sunja1472@gmail.com",
      phoneNumber: "090-6314-8807",
      userGrade: "BRONZE",
      loginType: "NORMAL",
      userImageUrl: "",
      userProfileImageUrl: "",
      firmName: "",
      firmAddress: "",
      businessRegistration: "",
      businessRegistrationCertificateImageUrl: "",
      firmWebUrl: "",
      firmEmail: "",
      firmPhone: "",
      saleAllowed: false,
    },
  ],
};
