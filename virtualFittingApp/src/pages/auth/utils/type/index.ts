import type {
  BrandUserTypeKey,
  TPhoneNumberKey,
  TPhoneNumerPart,
} from "@/pages/brand/types/brandUser";
import { type TLoginUserKey } from "../../types/auth";

export const isLoginKey = (key: string): key is TLoginUserKey => {
  const loginKey: readonly string[] = ["userId", "userPassword"];
  return loginKey.includes(key);
};

export const isBrandUserKey = (key: string): key is BrandUserTypeKey => {
  const brandUserKeys: readonly string[] = [
    "userNumber",
    "id",
    "password",
    "emailAddress",
    "phoneNumber",
    "userGrade",
    "loginType",
    "userImageUrl",
    "userProfileImageUrl",
    "firmName",
    "firmAddress",
    "businessRegistration",
    "businessRegistrationCertificateImageUrl",
    "firmWebUrl",
    "firmEmail",
    "firmPhone",
    "saleAllowed",
  ];
  return brandUserKeys.includes(key);
};

export const isPhoneNumber = (key: string): key is TPhoneNumberKey => {
  const phoneNumberKeys: readonly string[] = ["prefix", "middle", "suffix"];
  return phoneNumberKeys.includes(key);
};

export const combineKey = (parts: TPhoneNumerPart): string => {
  const combinedNumber =
    `${parts.prefix}${parts.middle}${parts.suffix}`.replace(/\s/g, "");

  if (!combinedNumber) {
    return "";
  }

  const numberWithoutLeadingZero = combinedNumber.startsWith("0")
    ? combinedNumber.substring(1)
    : combinedNumber;
  const internationalNumber = `+82${numberWithoutLeadingZero}`;

  return internationalNumber;
};
