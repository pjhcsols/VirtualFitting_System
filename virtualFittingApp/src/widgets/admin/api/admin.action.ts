import { API_BASILIUM } from "@/shared";

export const DELETE_BRAND_USER = async ({ idx }: { idx: number }) => {
  try {
    const res = await API_BASILIUM.delete(`/${idx}`);
  } catch (err) {
    return false;
  }
};

export const POST_BANNERS = async ({ banner }: { banner: File[] | null }) => {
  try {
    const res = await API_BASILIUM.post("", banner);
  } catch (err) {
    return false;
  }
};
