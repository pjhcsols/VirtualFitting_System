"use server";

import {
  API_BASILIUM,
  BasiliumResponse,
  ProductServerResponseType,
} from "@/shared";
import type { BrandUserType } from "@/pages/brand/types/brandUser";
import axios from "axios";

interface IBrandUser extends BasiliumResponse {
  data: BrandUserType;
}

export const getBrandUserInfo = async (): Promise<IBrandUser> => {
  const res = await API_BASILIUM.get<IBrandUser>("/b1/brandUsers/me");
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(`Unexpected status code: ${res.status}`);
};

export const modifyBrandUserInfo = async (
  request: BrandUserType,
): Promise<IBrandUser> => {
  const res = await API_BASILIUM.patch<IBrandUser>(
    "/b1/brandUsers/me",
    request,
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(`Unexpected status code: ${res.status}`);
};

// * Brand User 상품 관련
// * ================================================
type PaginationBrandProductListType = {
  size: number;
  page: number;
};

export const GET_BRAND_PRODUCT_LIST = async ({
  size,
  page,
}: PaginationBrandProductListType) => {
  try {
    const res = await API_BASILIUM.get<ProductServerResponseType[]>(
      `/b1/products/brand?page=${page}&size=${size}`,
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (err: any) {
    // Axios 의 Typeguard 를 이용해 Error Handling
    if (axios.isAxiosError(err)) {
      console.error(err.message);
    }
  }
};

// * Brand User 사업자 등록증 관련
// * ================================================
interface IBrandRegistrationFile extends BasiliumResponse {
  data: {
    userNumber: number;
    businessRegistration: string;
    fileName: string;
    url: string;
  };
}

export const getBrandRegistrationFile =
  async (): Promise<IBrandRegistrationFile> => {
    const res = await API_BASILIUM.get<IBrandRegistrationFile>(
      "/b1/brandUsers/me/busniess-cert",
    );
    if (res.status === 200) {
      return res.data;
    }
    throw new CustomException(
      res.status,
      "사업자 증명서 파일을 가져오기 실패하였습니다.",
    );
  };

export const postBrandRegistrationFile = async (
  fileItem: File,
): Promise<IBrandRegistrationFile> => {
  const formData = new FormData();
  formData.append("file", fileItem);
  const res = await API_BASILIUM.post(
    "/b1/brandUsers/me/busniess-cert",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data;",
      },
    },
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(res.status, "업로드에 실패하였습니다.");
};

// * ================================================
