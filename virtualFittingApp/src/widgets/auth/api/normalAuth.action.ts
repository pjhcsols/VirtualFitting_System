import { API_BASILIUM } from "@/shared";
import { type NormalUserSignUpRequestDto } from "../types/login";
import { isAxiosError } from "axios";

export const NormalUserSignUp = async (props: NormalUserSignUpRequestDto) => {
  try {
    const res = await API_BASILIUM.post("/b1/normalUsers", props);
    if (res.status === 201) {
      return 201;
    }
  } catch (err) {
    if (isAxiosError(err)) {
      return err.status;
    }
  }
};
