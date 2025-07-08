import * as S from "@/shared/components/header/ui/css/BrandHeader.css";
import { useNavigate } from "react-router-dom";
import {
  CardIcon,
  ClothesIcon,
  CouponIcon,
  GraphIcon,
  HomeIcon,
  LogoutIcon,
  RightArrowIcon,
  SettingIcon,
  ShopIcon,
} from "../../icon";
import { useState } from "react";

function BrandHeader() {
  const [isProductClicked, setIsProductClicked] = useState<boolean>(false);
  const router = useNavigate();

  const onClickBrandHomepage = () => {
    router("/brand/dashboard");
  };

  return (
    <S.Wrapper>
      <S.LogoContainer>
        <S.Logo onClick={onClickBrandHomepage}>Basilium</S.Logo>
      </S.LogoContainer>
      <S.InfoContainer>
        <S.InfoTitle>FOR BRAND</S.InfoTitle>
        <S.Navigation to={"/brand/dashboard"}>
          {({ isActive }: { isActive: boolean }) => (
            <S.InfoBox isActive={isActive}>
              <HomeIcon width="20px" height="20px" fill="none" />
              <S.InfoText>Home</S.InfoText>
            </S.InfoBox>
          )}
        </S.Navigation>
        <S.Navigation to={"/brand/my"}>
          {({ isActive }: { isActive: boolean }) => (
            <S.InfoBox isActive={isActive}>
              <SettingIcon width="20px" height="20px" fill="gray" />
              <S.InfoText>Account Settings</S.InfoText>
            </S.InfoBox>
          )}
        </S.Navigation>
        <S.Navigation to={"/brand/payment"}>
          {({ isActive }: { isActive: boolean }) => (
            <S.InfoBox isActive={isActive}>
              <CardIcon width="20px" height="20px" fill="gray" />
              <S.InfoText>Payment</S.InfoText>
            </S.InfoBox>
          )}
        </S.Navigation>
        <S.DropdownContainer>
          <S.DropdownBox
            clicked={isProductClicked}
            onClick={() => setIsProductClicked((prev) => !prev)}
          >
            <div>
              <ShopIcon width="20px" height="20px" fill="gray" />
              <S.InfoText>Product</S.InfoText>
            </div>
            <RightArrowIcon width="20px" height="20px" fill="gray" />
          </S.DropdownBox>
          <S.DropdownNavigation
            to={"/brand/product"}
            clicked={isProductClicked}
          >
            {({ isActive }: { isActive: boolean }) => (
              <S.InfoBox isActive={isActive}>
                <ClothesIcon width="20px" height="20px" fill="gray" />
                <S.InfoText>Goods</S.InfoText>
              </S.InfoBox>
            )}
          </S.DropdownNavigation>
          <S.DropdownNavigation to={"/brand/coupon"} clicked={isProductClicked}>
            {({ isActive }: { isActive: boolean }) => (
              <S.InfoBox isActive={isActive}>
                <CouponIcon width="20px" height="20px" fill="gray" />
                <S.InfoText>Coupon</S.InfoText>
              </S.InfoBox>
            )}
          </S.DropdownNavigation>
        </S.DropdownContainer>
        <S.Navigation to={"/brand/analytics"}>
          {({ isActive }: { isActive: boolean }) => (
            <S.InfoBox isActive={isActive}>
              <GraphIcon width="20px" height="20px" fill="gray" />
              <S.InfoText>Analytics</S.InfoText>
            </S.InfoBox>
          )}
        </S.Navigation>
        <S.Navigation to={"/"}>
          {({ isActive }: { isActive: boolean }) => (
            <S.InfoBox isActive={isActive}>
              <LogoutIcon width="20px" height="20px" fill="gray" />
              <S.InfoText>Logout</S.InfoText>
            </S.InfoBox>
          )}
        </S.Navigation>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { BrandHeader };
