import { API_BASILIUM } from "../config";

export const logout = async () => {
  const res = await API_BASILIUM.post("/b1/users/logout");
  if (res.status === 200) {
    return true;
  }
  throw new CustomException(res.status, "로그아웃이 진행되지 않았습니다.");
};
