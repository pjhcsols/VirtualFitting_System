export type ServerCouponDto = {
  id: number;
  brandUserNumber: number;
  scope: "BRAND";
  productId: number;
  percent: number;
  minOrderPrice: number;
  maxDiscountPrice: number;
  startAt: string; // LocalDateTime
  endAt: string; // LocalDateTime
  perUserLimit: number;
  totalIssuable: number;
  issuedCount: number;
  status: "SCHEDULED";
  createdAt: string; // LocalDateTime
};

export type ClientCouponDto = {
  scope: "BRAND";
  productId: number;
  percent: number;
  minOrderPrice: number;
  maxDiscountPrice: number;
  startAt: string; // LocalDateTime
  endAt: string; // LocalDateTime
  perUserLimit: number;
  totalIssuable: number;
};
