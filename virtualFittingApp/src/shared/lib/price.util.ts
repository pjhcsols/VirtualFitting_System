import type { CartItem } from "@/entities/cart";
import type { ClaimableCoupon } from "@/entities/coupon";

export const calculateFinalPrice = (
  basePrice: number,
  quantity: number,
  coupon: ClaimableCoupon | null
): number => {
  const totalPrice = basePrice * quantity;

  if (!coupon) {
    return totalPrice;
  }

  let couponDiscount = totalPrice * (coupon.percent / 100);
  if (couponDiscount > coupon.maxDiscountPrice) {
    couponDiscount = coupon.maxDiscountPrice;
  }

  return Math.round(totalPrice - couponDiscount);
};