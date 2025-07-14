import { API_BASILIUM } from "@/shared";
import { type NormalUserSignUpRequestDto } from "../types/login";

export const NormalUserSignUp = async (props: NormalUserSignUpRequestDto) => {
  try {
    const res = await API_BASILIUM.post("/b1/normalUsers", props);
    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    return err;
  }
};
