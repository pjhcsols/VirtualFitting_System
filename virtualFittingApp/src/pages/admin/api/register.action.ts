import { API_BASILIUM } from "../../../shared";
import { ProductInputType } from "../types/Product";

export const delete_product = async (productId: number) => {
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

export const create_product = async (request: ProductInputType) => {
  try {
    const res = await API_BASILIUM.post("/products/deleteProduct", request);
    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};

export const update_product = async (request: ProductInputType) => {
  try {
    const res = await API_BASILIUM.post("/products/deleteProduct", request);
    if (res.status === 201) {
      return res.data;
    }
  } catch (err) {
    return false;
  }
};
