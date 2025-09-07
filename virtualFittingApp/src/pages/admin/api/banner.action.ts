"use server";

import { API_BASILIUM, BasiliumResponse } from "@/shared";
import { type TBanner } from "../types/Banner";

interface IBanner extends BasiliumResponse {
  data: TBanner[];
}

export const getBanners = async (): Promise<IBanner> => {
  const res = await API_BASILIUM.get(
    "/b1/superUsers/me/banners?adminId=super_ad",
  );
  if (res.status === 200) {
    console.log(res);
    return res.data;
  }
  throw new CustomException(400, "배너를 받아들여올 수 없습니다.");
};

export const postBanners = async (files: File[]) => {
  const formData = new FormData();
  files.map((item: File, _) => {
    formData.append("files", item);
  });
  const res = await API_BASILIUM.post("/b1/superUsers/me/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (res.status === 201) {
    return res.data;
  }
  throw new CustomException(400, "배너를 업로드할 수 없습니다.");
};

export const modifyBanners = async (files: File[]) => {
  const formData = new FormData();
  files.map((item, _) => {
    formData.append("files", item);
  });
  const res = await API_BASILIUM.put("/b1/superUsers/me/banners", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(400, "배너를 업로드할 수 없습니다.");
};

export const deleteBanner = async (fileName: string) => {
  const res = await API_BASILIUM.delete(
    `/b1/superUsers/me/banners?fileName=${fileName}`,
  );
  if (res.status === 200) {
    return true;
  }
  throw new CustomException(400, "배너를 삭제할 수 없습니다.");
};
