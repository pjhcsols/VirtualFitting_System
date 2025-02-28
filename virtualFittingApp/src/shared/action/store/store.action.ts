import { API_BASILIUM, API_BASILIUM_AI } from "@/shared/config";
import { ColorType, SizeType } from "@/shared/types";

export const getStoreProductsAPI = async () => {
  try {
    const res = await API_BASILIUM.get("/products/getAll");
    if (res.status === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const getSigleProductAPI = async ({
  productId,
}: {
  productId: string;
}) => {
  try {
    const res = await API_BASILIUM.get(`/products/${productId}`);
    if (res.status === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const getProductsCategoryAPI = async ({
  categoryId,
}: {
  categoryId: number;
}) => {
  try {
    const res = await API_BASILIUM.get(`/products/category/${categoryId}`);
    if (res.status === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const sendHeartAPI = async ({ productId }: { productId: number }) => {
  try {
    const res = await API_BASILIUM.post(`/normalUser/like/${productId}`);
    if (res.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

type ProductOptionType = {
  size: SizeType | null;
  color: ColorType | null;
  amount: number;
};

export const postShoppingCartAPI = async ({
  productId,
  option,
}: {
  productId: number;
  option: ProductOptionType;
}) => {
  try {
    const formData = new URLSearchParams();
    formData.append("size", option.size ?? "L");
    formData.append("color", option.color ?? "WHITE");
    formData.append("amount", option.amount.toString());
    const res = await API_BASILIUM.post(
      `/normalUser/shopping/${productId}`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (res.status === 201) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const getAIResultAPI = async ({ photoUrl }: { photoUrl: string }) => {
  try {
    const res = await API_BASILIUM_AI.post("/receive_data", photoUrl);
    if (res.status === 201) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

export const postAIDataAPI = async () => {
  try {
    const res = await API_BASILIUM_AI.post("/acknowledge_receipt");
    if (res.status === 201) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};
