import { BasiliumResponse, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { globalEventBus } from "@/shared/event/types/event.d";
import { AUTH_ERROR_STATUS } from "../constants";
import { TBrandUser } from "../types/auth";

interface ISignUpResponse extends BasiliumResponse {}

export const signUpBrand = async ({ user }: { user: TBrandUser }) => {
  const phoneNumber = "+82" + user.phoneNumber.replace(/[^0-9]/g, "");
  const firmNumber = "+82" + user.firmPhone.replace(/[^0-9]/g, "");
  const request: TBrandUser = {
    ...user,
    phoneNumber: phoneNumber,
    firmPhone: firmNumber,
  };
  const res = await NOT_LOGGED_BASILIUM_API.post<ISignUpResponse>(
    "/b1/brandUsers/signup",
    request,
  );
  if (res.status !== 201) {
    globalEventBus.emit("api-error", AUTH_ERROR_STATUS.get("CANNOT_SIGN_UP"));
  }
};
