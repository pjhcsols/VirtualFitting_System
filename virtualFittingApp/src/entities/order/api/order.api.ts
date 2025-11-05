import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export const OrderInfo = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const res = await API_BASILIUM.get(
    `/b1/orders/my?page=${page}&size=${size}`,
  );
  if (res.status === 200) {
    console.log("주문 내역을 가져오는데 성공했습니다.");
    return res.data;
  }
  throw new CustomException(res.status, "주문 내역을 가져오는데 실패했습니다.");
};
