"use server";

import { type BrandUserType } from "@/pages/brand";
import { BasiliumResponse, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { combineKey } from "../utils/type";
import { TPhoneNumerPart } from "@/pages/brand/types/brandUser";
import { globalEventBus } from "@/shared/event/types/event";
import { AUTH_ERROR_STATUS } from "../constants";

interface ISignUpBrand {
  user: BrandUserType;
  phoneNumber: TPhoneNumerPart;
  firmPhoneNumber: TPhoneNumerPart;
}

interface ISignUpResponse extends BasiliumResponse {}

export const signUpBrand = async ({
  user,
  phoneNumber,
  firmPhoneNumber,
}: ISignUpBrand) => {
  const request: BrandUserType = {
    ...user,
    ["firmEmail"]: combineKey(phoneNumber),
    ["phoneNumber"]: combineKey(firmPhoneNumber),
  };
  const res = await NOT_LOGGED_BASILIUM_API.post<ISignUpResponse>(
    "/b1/brandUsers/signup",
    request,
  );
  if (res.status !== 201) {
    globalEventBus.emit("api-error", AUTH_ERROR_STATUS.get("CANNOT_SIGN_UP"));
  }
};
