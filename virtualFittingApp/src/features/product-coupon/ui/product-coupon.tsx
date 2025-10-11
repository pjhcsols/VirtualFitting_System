import { useProductCoupon } from "../hooks/use-product-coupon";
import * as S from "./product-coupon.styled";
import type { ClaimableCoupon } from "@/entities/coupon";

type ProductCouponProps = {
  productId: number;
};

export function ProductCoupon({ productId }: ProductCouponProps) {
  const { coupons, showCouponPopup, setShowCouponPopup, handleDownloadCoupon } =
    useProductCoupon(productId);

  return (
    <>
      {coupons && coupons.length > 0 && (
        <S.CouponButton onClick={() => setShowCouponPopup(true)}>
          쿠폰받기
        </S.CouponButton>
      )}

      {showCouponPopup && (
        <S.CouponPopupOverlay onClick={() => setShowCouponPopup(false)}>
          <S.CouponPopupContent onClick={(e) => e.stopPropagation()}>
            <S.CloseButton onClick={() => setShowCouponPopup(false)}>
              ×
            </S.CloseButton>
            <S.CouponItems>
              {coupons.map((coupon) => (
                <S.CouponItem
                  key={coupon.campaignId}
                  disabled={!coupon.hasAvailable}
                >
                  <div>{coupon.scope} 쿠폰</div>
                  <div>
                    {coupon.percent}% / 최대{" "}
                    {coupon.maxDiscountPrice.toLocaleString()}원
                  </div>
                  <div>
                    최소 주문 {coupon.minOrderPrice.toLocaleString()}원 이상
                  </div>
                  {coupon.hasAvailable ? (
                    <S.UseButton
                      onClick={() => handleDownloadCoupon(coupon.campaignId)}
                    >
                      발급하기
                    </S.UseButton>
                  ) : (
                    <S.DisabledText>조건 미달</S.DisabledText>
                  )}
                </S.CouponItem>
              ))}
            </S.CouponItems>
          </S.CouponPopupContent>
        </S.CouponPopupOverlay>
      )}
    </>
  );
}

type SelectedCouponDisplayProps = {
  coupon: ClaimableCoupon | null;
  onRemove: () => void;
};

export function SelectedCouponDisplay({
  coupon,
  onRemove,
}: SelectedCouponDisplayProps) {
  if (!coupon) {
    return null;
  }

  return (
    <S.CouponDisplayBox>
      <S.CouponInfo>
        <S.CouponLabel>쿠폰 적용</S.CouponLabel>
        <S.CouponDetails>
          {coupon.scope} 쿠폰 ({coupon.percent}%)
        </S.CouponDetails>
      </S.CouponInfo>
      <S.CouponRemoveButton onClick={onRemove}>×</S.CouponRemoveButton>
    </S.CouponDisplayBox>
  );
}
