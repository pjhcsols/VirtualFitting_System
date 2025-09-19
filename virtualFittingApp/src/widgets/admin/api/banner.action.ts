import { API_BASILIUM, BasiliumResponse } from "@/shared";

// * QueryParameter
// Filename - String
export const DELETE_BRAND_USER = async () => {
  try {
    const res = await API_BASILIUM.delete("/b1/superUsers/me/banners/");
    if (res.status === 204) {
      return true;
    }
  } catch (err) {
    return false;
  }
};

export const POST_BANNERS = async ({ banners }: { banners: File[] | null }) => {
  try {
    if (banners === null) {
      return null;
    }
    const formData = new FormData();
    banners.forEach((banner) => {
      formData.append("files", banner);
    });
    const res = await API_BASILIUM.post("/b1/superUsers/me/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};

interface BannerData extends BasiliumResponse {
  data: BannerDataType;
}

type BannerDataType = {
  userNumber: number;
  fileName: string;
  url: string;
};

export const GET_BANNERS = async () => {
  try {
    const res = await API_BASILIUM.get<BannerData>("/b1/superUsers/me/banners");
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};
