import { type BrandUserType } from "@/pages/brand";
import { BasiliumResponse, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { globalEventBus } from "@/shared/event/types/event.d";
import { AUTH_ERROR_STATUS } from "../constants";

interface ISignUpBrand {
  user: BrandUserType;
  firmPhone: string;
  phone: string;
  businessRegistration: string;
}

interface ISignUpResponse extends BasiliumResponse {}

export const signUpBrand = async ({
  user,
  phone,
  firmPhone,
  businessRegistration,
}: ISignUpBrand) => {
  const phoneNumber = "+82" + phone.replace(/[^0-9]/g, "");
  const firmNumber = "+82" + firmPhone.replace(/[^0-9]/g, "");
  const request: BrandUserType = {
    ...user,
    phoneNumber: phoneNumber,
    firmPhone: firmNumber,
    businessRegistration: businessRegistration,
  };
  const res = await NOT_LOGGED_BASILIUM_API.post<ISignUpResponse>(
    "/b1/brandUsers/signup",
    request,
  );
  if (res.status !== 201) {
    globalEventBus.emit("api-error", AUTH_ERROR_STATUS.get("CANNOT_SIGN_UP"));
  }
};
