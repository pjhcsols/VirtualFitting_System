import { API_BASILIUM, FileItem } from "@/shared";
import { type BrandUserSignUpRequestDto } from "../types/login";
import { isAxiosError } from "axios";

export const brandUserSignUpApi = async (props: BrandUserSignUpRequestDto) => {
  try {
    const res = await API_BASILIUM.post("/brandUsers/signup", props);
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      console.log(err);
      return err;
    }
    console.log(err);
    return err.status;
  }
};

export const uploadBusinessRegistration = async (props: FileItem[]) => {
  try {
    const formData = new FormData();

    props.forEach((fileItem, _) => {
      formData.append("files", fileItem.file);
    });

    const res = await API_BASILIUM.post("/brandUsers/me/business-cert", props, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

export const updateUserInfo = async (props: BrandUserSignUpRequestDto) => {
  try {
    const res = await API_BASILIUM.post("/brandUsers/me", props);
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
