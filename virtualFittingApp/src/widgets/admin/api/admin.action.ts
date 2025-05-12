import { API_BASILIUM } from "@/shared";

export const DELETE_BRAND_USER = async ({ idx }: { idx: number }) => {
  try {
    const res = await API_BASILIUM.delete(`/${idx}`);
  } catch (err) {
    return false;
  }
};
