import { API_BASILIUM } from "@/shared";

export const brandUserSignUp = async () => {
  try {
    const res = await API_BASILIUM.post("/brandUser/signup");
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};
