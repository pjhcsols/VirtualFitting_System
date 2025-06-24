import * as S from "@/shared/components/header/ui/css/BrandHeader.css";
import { ICON_MENU } from "@/shared";
import { useScrollDetector } from "@/shared/hooks";
import { useNavigate } from "react-router-dom";

function BrandHeader() {
  const router = useNavigate();
  const isScrolled = useScrollDetector();

  const onClickBrandHomepage = () => {
    router("/brand/dashboard");
  };

  return (
    <S.Wrapper isScrolled={isScrolled}>
      <S.MenuContainer>
        <S.ICON_MENU src={ICON_MENU} alt="menu-icon" />
      </S.MenuContainer>
      <S.LogoContainer>
        <S.Logo onClick={onClickBrandHomepage}>Basilium</S.Logo>
      </S.LogoContainer>
    </S.Wrapper>
  );
}

export { BrandHeader };
