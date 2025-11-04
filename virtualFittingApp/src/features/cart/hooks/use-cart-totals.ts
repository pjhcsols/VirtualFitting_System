import { useMemo } from 'react';
import type { CartItem } from '@/entities/cart'; 
import type { ClaimableCoupon } from '@/entities/coupon';

interface CalculatedTotals {
    productAmount: number;
    totalBrandDiscount: number;
    totalCouponDiscount: number;
    finalDiscount: number;
    shippingFee: number;
    totalAmount: number;
}

const calculateItemCouponDiscount = (
    itemPriceAfterBrandDiscount: number,
    itemQuantity: number,
    coupon: ClaimableCoupon
): number => {
    
    const itemTotalBasePrice = itemPriceAfterBrandDiscount * itemQuantity;
    const calculatedDiscount = Math.floor(itemTotalBasePrice * (coupon.percent / 100));
    
    return Math.min(calculatedDiscount, coupon.maxDiscountPrice);
};
export const useCartTotals = (
    cartItems: CartItem[], 
    selectedCouponMap: Map<number, ClaimableCoupon | null>
): CalculatedTotals => {
    
    return useMemo(() => {
        let productAmount = 0; 
        let totalDiscountedPrice = 0; 
        let totalCouponDiscount = 0; 

        cartItems.forEach(item => {
            const itemOriginalAmount = item.price * item.quantity;
            const itemDiscountedAmount = (item.discountedPrice ?? item.price) * item.quantity;
            
            productAmount += itemOriginalAmount;
            totalDiscountedPrice += itemDiscountedAmount; 
            
            const selectedCoupon = selectedCouponMap.get(item.id);

            if (selectedCoupon && selectedCoupon.walletId !== null) {
                
                const couponDiscount = calculateItemCouponDiscount(
                    item.discountedPrice ?? item.price,
                    item.quantity,
                    selectedCoupon
                );
                
                totalCouponDiscount += couponDiscount;
            }
        });

        const totalBrandDiscount = productAmount - totalDiscountedPrice;
        const finalProductPrice = totalDiscountedPrice - totalCouponDiscount;
        const totalDiscount = totalBrandDiscount + totalCouponDiscount;
        const shippingFee = finalProductPrice >= 50000 ? 0 : 3000;
        const finalPayableAmount = finalProductPrice + shippingFee;

        return {
            productAmount,
            totalBrandDiscount,
            totalCouponDiscount,
            finalDiscount: Math.max(0, totalDiscount), 
            shippingFee,
            totalAmount: Math.max(0, finalPayableAmount),
        };
    }, [cartItems, selectedCouponMap]);
};
