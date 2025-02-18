import { API_BASILIUM } from "@/shared/config/AxiosConfig";

export const post_shopping_cart = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    const res = API_BASILIUM.post(`/normalUser/shopping/${productId}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const post_like = async ({ productId }: { productId: string }) => {
  try {
    const res = API_BASILIUM.post(`/normalUser/like/${productId}`);
    return res;
  } catch (err) {
    return err;
  }
};
