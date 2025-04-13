import * as S from "@/shared/components/header/ui/css/BrandHeader.css";
import { MENU_ICON } from "@/shared/components/header/constants";
import { useScrollDetector } from "@/shared/hooks";
import { useNavigate } from "react-router-dom";

function BrandHeader() {
  const router = useNavigate();
  const isScrolled = useScrollDetector();

  const onClickBrandHomepage = () => {
    router("/brand");
  };

  return (
    <S.Wrapper isScrolled={isScrolled}>
      <S.MenuContainer>
        <S.MENU_ICON src={MENU_ICON} alt="menu-icon" />
      </S.MenuContainer>
      <S.LogoContainer>
        <S.Logo onClick={onClickBrandHomepage}>Basilium</S.Logo>
      </S.LogoContainer>
    </S.Wrapper>
  );
}

export { BrandHeader };
