import { BasiliumResponse, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { globalEventBus } from "@/shared/event/types/event.d";
import { AUTH_ERROR_STATUS } from "../constants";
import { type NormalUserType } from "@/entities/auth/types/normal.d";

interface ISignUpBrand {
  user: NormalUserType;
  phone: string;
  birthday: string;
}

interface ISignUpResponse extends BasiliumResponse {}

export const signUpNormal = async ({ user, phone, birthday }: ISignUpBrand) => {
  const phoneNumber = "+82" + phone.replace(/[^0-9]/g, "");
  const request: NormalUserType = {
    ...user,
    phoneNumber: phoneNumber,
    birthDate: birthday,
  };
  const res = await NOT_LOGGED_BASILIUM_API.post<ISignUpResponse>(
    "/b1/normalUsers",
    request,
  );
  if (res.status !== 201) {
    globalEventBus.emit("api-error", AUTH_ERROR_STATUS.get("CANNOT_SIGN_UP"));
  }
};
