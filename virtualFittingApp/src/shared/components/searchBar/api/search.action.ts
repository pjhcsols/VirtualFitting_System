import { API_BASILIUM } from "../../../config/axios/AxiosConfig";

export const search_product = async (searchValue: string) => {
  try {
    const res = await API_BASILIUM.get(`/${searchValue}`);
    return res;
  } catch (err) {
    return err;
  }
};
