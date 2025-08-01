import { API_BASILIUM } from "@/shared";
import { type BrandUserSignUpRequestDto } from "../types/login";
import { isAxiosError } from "axios";

export const BrandUserSignUp = async (props: BrandUserSignUpRequestDto) => {
  try {
    const res = await API_BASILIUM.post("/brandUser/signup", props);
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
    return err.status;
  }
};
