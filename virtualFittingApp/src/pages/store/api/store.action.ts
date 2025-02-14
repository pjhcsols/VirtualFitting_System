import { API_BASILIUM, API_BASILIUM_AI } from "../../../shared";

const get_store_products = async () => {
  try {
    const res = await API_BASILIUM.get("/products/getAll");
    return res.data;
  } catch (err) {
    return err;
  }
};

const get_product = async () => {
  try {
    const res = await API_BASILIUM.get("/products/${productId}");
    return res;
  } catch (err) {
    return err;
  }
};

const post_heart_click = async (productId: string) => {
  try {
    const res = await API_BASILIUM.post(`/normalUser/like/${productId}`);
    return true;
  } catch (err) {
    return err;
  }
};

const post_shopping_cart = async (productId: string) => {
  try {
    const res = await API_BASILIUM.post(`/normalUser/shopping/${productId}`);
    return res.data;
  } catch (err) {
    return err;
  }
};

const get_AI_data = async (photoUrl: string) => {
  try {
    const res = await API_BASILIUM_AI.post("/receive_data", photoUrl);
  } catch (err) {
    return err;
  }
};

const post_AI_data = async () => {
  try {
    const res = await API_BASILIUM_AI.post("/acknowledge_receipt");
  } catch (err) {
    return err;
  }
};
