export const couponKeys = {
  claimables: (productId: number, accessToken: string | undefined) => 
    ['coupons', 'claimables', productId, accessToken] as const,
};
