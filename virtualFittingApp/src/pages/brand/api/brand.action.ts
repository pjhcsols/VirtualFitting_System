"use server";

import {
  API_BASILIUM,
  BasiliumResponse,
  ClientProductDto,
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

// * 상품 관련 API
// * ================================================
export const postProduct = async (
  product: ClientProductDto,
  mainPhotoFiles: File[],
  subPhotoFiles: File[],
) => {
  if (mainPhotoFiles.length === 0) {
    throw new CustomException(400, "메인 프로필 사진이 없습니다.");
  }

  if (subPhotoFiles.length === 0) {
    throw new CustomException(400, "서브 프로필 사진이 없습니다.");
  }

  // * 메인 사진 전송
  const mainPhotoFormData = new FormData();
  mainPhotoFiles.map((item, _) => {
    mainPhotoFormData.append("file", item);
  });
  const mainPhotos = await API_BASILIUM.post(
    "/aws/products/upload-photo",
    mainPhotoFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (mainPhotos.status !== 200) {
    throw new CustomException(
      mainPhotos.status,
      "파일을 업로드하지 못했습니다.",
    );
  }

  // * 상품 옵션 사진 데이터 전송
  const subPhotoFormData = new FormData();
  subPhotoFiles.map((item, _) => {
    subPhotoFormData.append("file", item);
  });
  const subPhotos = await API_BASILIUM.post(
    "/aws/products/upload-photo",
    subPhotoFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  if (subPhotos.status !== 200) {
    throw new CustomException(
      subPhotos.status,
      "파일을 업로드하지 못했습니다.",
    );
  }

  // * 상품 업로드
  let request: ClientProductDto = product;
  if (request.productColorOptions.length > 1) {
    request.productColorOptions[length - 1].productPhotoUrls = mainPhotos.data;
    request.productColorOptions[length - 1].productSubPhotoUrls =
      subPhotos.data;
  }
  const res = await API_BASILIUM.post("/b1/products", request);
  if (res.status === 201) {
    return res.data;
  }
  throw new CustomException(res.status, "상품을 업로드하지 않았습니다!");
};
