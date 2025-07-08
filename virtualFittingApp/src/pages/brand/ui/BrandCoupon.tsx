import * as S from "@/pages/brand/ui/css/BrandCoupon.css";
import { BrandCouponCard, ExpiredCouponIcon } from "@/shared";

function BrandCoupon() {
  return (
    <S.Wrapper>
      <S.CouponBannerWrapper>
        <S.CouponTitle>쿠폰</S.CouponTitle>
      </S.CouponBannerWrapper>
      <BrandCouponCard couponCount={0} />
      <S.CouponExpiredCountPanel>
        <S.ExpiredCouponPanel>
          <ExpiredCouponIcon width="24px" height="24px" fill="black" />
        </S.ExpiredCouponPanel>
        <S.ExpiredText>발행 종료된 쿠폰</S.ExpiredText>
        <S.ExpiredTitle>0</S.ExpiredTitle>
      </S.CouponExpiredCountPanel>
      <S.CouponList>
        <S.CouponSmallTitle>쿠폰 발행 리스트</S.CouponSmallTitle>
      </S.CouponList>
      <S.CouponCreatePanel>
        <S.CouponSmallTitle>쿠폰 추가 버튼</S.CouponSmallTitle>
      </S.CouponCreatePanel>
    </S.Wrapper>
  );
}

export { BrandCoupon };
