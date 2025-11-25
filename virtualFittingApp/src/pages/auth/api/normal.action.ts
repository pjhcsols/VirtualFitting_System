import { BasiliumResponse, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { globalEventBus } from "@/shared/event/types/event.d";
import { AUTH_ERROR_STATUS } from "../constants";
import { type NormalUserType } from "@/entities/auth/types/normal.d";
import { TNormalUser } from "../types/auth";

interface ISignUpResponse extends BasiliumResponse {}

export const signUpNormal = async ({ user }: { user: TNormalUser }) => {
  const phoneNumber = "+82" + user.phoneNumber.replace(/[^0-9]/g, "");

  const request: NormalUserType = {
    ...user,
    phoneNumber: phoneNumber,
    birthDate: user.birthDate + "T00:00:00",
  };
  console.log(request);
  const res = await NOT_LOGGED_BASILIUM_API.post<ISignUpResponse>(
    "/b1/normalUsers",
    request,
  );
  if (res.status !== 201) {
    globalEventBus.emit("api-error", AUTH_ERROR_STATUS.get("CANNOT_SIGN_UP"));
  }
};
