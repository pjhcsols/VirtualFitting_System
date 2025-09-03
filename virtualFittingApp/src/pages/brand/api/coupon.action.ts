"use server";

import { API_BASILIUM } from "@/shared";
import { ClientCouponDto } from "../types/coupon";

export const getCouponList = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const res = await API_BASILIUM.get(
    `/b1/coupons/brands/me/campaigns?page=${page}&size=${size}`,
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(res.status, "쿠폰 리스트를 가져오지 못하였습니다!");
};

export const postCoupon = async (coupon: ClientCouponDto) => {
  const res = await API_BASILIUM.post(
    "/b1/coupons/brands/me/campaigns",
    coupon,
  );
  if (res.status === 201) {
    return res.data;
  }
  throw new CustomException(res.status, "쿠폰을 업로드하지 못하였습니다.");
};

export const patchCoupon = async (id: number, coupon: ClientCouponDto) => {
  const res = await API_BASILIUM.patch(
    `/b1/coupons/brands/me/campaigns/${id}`,
    coupon,
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new CustomException(res.status, "쿠폰을 업로드하지 못하였습니다.");
};
