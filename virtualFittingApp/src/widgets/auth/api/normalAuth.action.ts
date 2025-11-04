import { API_BASILIUM, NOT_LOGGED_BASILIUM_API } from "@/shared";
import { type NormalUserSignUpRequestDto } from "../types/login";
import { isAxiosError } from "axios";

export const NormalUserSignUp = async (props: NormalUserSignUpRequestDto) => {
  try {
    const res = await NOT_LOGGED_BASILIUM_API.post("/b1/normalUsers", props);
    if (res.status === 201) {
      return 201;
    }
  } catch (err) {
    if (isAxiosError(err)) {
      return err.status;
    }
  }
};

export const NormalUserProfileUpload = async (file: File | null) => {
  try {
    const res = await API_BASILIUM.post("/b1/users/me/profile-image", file);
    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
    return err.status;
  }
};

export const NormalUserGetProfile = async () => {
  try {
    const res = await API_BASILIUM.get("/b1/users/me/profile-image");
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
    return err.status;
  }
};

export const NormalUserImgUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await API_BASILIUM.post("/b1/users/me/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 200) {
      console.log("응답 성공: ", res.data);
      return true;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
    return err.status;
  }
};

export const NormalUserGetImg = async () => {
  try {
    const res = await API_BASILIUM.get("/b1/users/me/image");
    if (res.status === 200) {
      console.log("응답 성공: ", res.data);
      return res.data;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
    return err.status;
  }
};
