import { API_BASILIUM } from "@/shared";
import { BrandUserType } from "@/pages/brand/types/brandUser";

export const MODIFY_BRAND_INFO = async (request: BrandUserType) => {
  try {
    const res = await API_BASILIUM.post("/modify", request);
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

type GetBrandInfoType = {
  page: number;
  size: number;
};

export const GET_BRAND_INFO = async ({ page, size }: GetBrandInfoType) => {
  try {
    const res = await API_BASILIUM.get(`/brand?page=${page}&size=${size}`);
    if (res.status === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};
