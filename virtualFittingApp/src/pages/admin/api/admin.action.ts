"use server";

import { BrandUserType } from "@/pages/brand";
import { API_BASILIUM, BasiliumResponse, ServerProductDto } from "@/shared";
import { type AxiosResponse } from "axios";

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

// * Product
// * ============================================================================================================================================

interface IFindProduct {
  productName: string;
}

interface IFindProductResponse extends AxiosResponse {
  data: ServerProductDto[];
}

export const findProduct = async ({
  productName,
}: IFindProduct): Promise<IFindProductResponse> => {
  const res = await API_BASILIUM.get<IFindProductResponse>(
    `/b1/products/on-sale?productName=${productName}`,
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(500, "상품을 가져올 수 없습니다! 서버 문제 발생!");
};
