"use server";

import { API_BASILIUM, FileItem, ProductServerResponseType } from "@/shared";
import {
  BrandAuthenticationType,
  BrandUserType,
} from "@/pages/brand/types/brandUser";
import axios from "axios";

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
    const res = await API_BASILIUM.get(
      `/b1/products/?page=${page}&size=${size}`,
    );
    if (res.status === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

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
      `/b1/products?page=${page}&size=${size}`,
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

export const GET_BRAND_AUTHENTICATION = async () => {
  try {
    const res = await API_BASILIUM.get("/b1/brandUsers/me/busniess-cert");
    if (res.status === 200) {
      return res.data as BrandAuthenticationType;
    }
  } catch (err) {
    if (!axios.isAxiosError(err)) return err;
    if (err.status === 401) {
      console.log("내잘못");
      console.log(err.message);
      return err;
    }
    console.log(err);
    return err;
  }
};

export const POST_BRAND_AUTHENTICATION = async (fileItem: FileItem) => {
  try {
    const formData = new FormData();
    formData.append("file", fileItem.file);
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
      return true;
    }
  } catch (err) {
    if (!axios.isAxiosError(err)) return err;
    if (err.status === 401) {
      console.log("내잘못");
      console.log(err.message);
      return err;
    }
    console.log(err);
    return err;
  }
};
