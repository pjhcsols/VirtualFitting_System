export type ServerCouponDto = {
  id: number;
  brandUserNumber: number;
  scope: "BRAND";
  productId: number;
  percent: number;
  minOrderPrice: number;
  maxDiscountPrice: number;
  startAt: string;
  endAt: string;
  perUserLimit: number;
  totalIssuable: number;
  issuedCount: number;
  status: "SCHEDULED";
  createdAt: string;
};

export type ClientCouponDto = {
  scope: "BRAND";
  productId: number;
  percent: number;
  minOrderPrice: number;
  maxDiscountPrice: number;
  startAt: string;
  endAt: string;
  perUserLimit: number;
  totalIssuable: number;
};
