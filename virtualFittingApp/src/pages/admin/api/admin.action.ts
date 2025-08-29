"use server";

import { BrandUserType } from "@/pages/brand";
import { API_BASILIUM, BasiliumResponse } from "@/shared";

interface IBrandUsers extends BasiliumResponse {
  data: BrandUserType[];
}

export const getNotAllowedBrandUsers = async (): Promise<IBrandUsers> => {
  const res = await API_BASILIUM.get<IBrandUsers>(
    "/b1/brandUsers/all?saleAllowed=false",
  );
  console.log(res);
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(400, "가져올 수 없습니다.");
};
