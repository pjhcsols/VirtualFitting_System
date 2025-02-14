import { API_BASILIUM } from "../../../shared";
import { type UserSignUpType } from "../types/signup";

export const post_user_signup = async (request: UserSignUpType) => {
  try {
    const res = await API_BASILIUM.post("/normalUser/signup", request);
    return true;
  } catch (err) {
    return err;
  }
};

export const post_brand_signup = async () => {
  try {
  } catch (err) {
    return err;
  }
};
