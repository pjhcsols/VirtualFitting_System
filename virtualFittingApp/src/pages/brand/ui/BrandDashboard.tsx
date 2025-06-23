import * as S from "@/pages/brand/ui/css/BrandDashboard.css";
import {
  BrandBannerCard,
  BrandClothesCard,
  BrandCouponCard,
  BrandHeartCard,
  BrandIncomeCard,
  BrandProfitGraphCard,
} from "@/shared";

function BrandDashboard() {
  return (
    <S.Wrapper>
      <BrandBannerCard username="BASILIUM" />
      <BrandCouponCard couponCount={10} />
      <BrandIncomeCard income={45000} />
      <BrandProfitGraphCard />
      <BrandHeartCard likedCount={100} />
      <BrandClothesCard sellCount={3500} />
    </S.Wrapper>
  );
}

export { BrandDashboard };
