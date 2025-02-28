import { API_BASILIUM } from "@/shared";
import { ProductInputType } from "@/pages/admin/types/Product";

export const deleteProductAPI = async (productId: number) => {
  try {
    const res = await API_BASILIUM.delete(
      `/products/deleteProduct/${productId}`
    );
    if (res.status === 204) {
      return true;
    }
  } catch (err) {
    return false;
  }
};

export const createProductAPI = async (request: ProductInputType) => {
  try {
    const res = await API_BASILIUM.post("/products/deleteProduct", request);
    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};

export const updateProductAPI = async (request: ProductInputType) => {
  try {
    const res = await API_BASILIUM.post("/products/deleteProduct", request);
    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};
