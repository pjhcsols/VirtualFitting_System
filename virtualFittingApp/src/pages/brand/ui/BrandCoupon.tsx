import * as S from "@/pages/brand/ui/css/BrandCoupon.css";
import { BrandCouponCard } from "@/shared";

function BrandCoupon() {
  return (
    <S.Wrapper>
      <S.CouponBannerWrapper>
        <S.CouponTitle>쿠폰</S.CouponTitle>
      </S.CouponBannerWrapper>
      <BrandCouponCard couponCount={0} />
      <S.CouponList>
        <S.CouponSmallTitle>쿠폰 발행 리스트</S.CouponSmallTitle>
      </S.CouponList>
    </S.Wrapper>
  );
}

export { BrandCoupon };
