import { Outlet } from "react-router-dom";
import { Header } from "./components/header";
import * as S from "./style";

function BrandLayout() {
  return (
    <S.Wrapper>
      <Header />
      <S.ContentContainer>
        <Outlet />
      </S.ContentContainer>
    </S.Wrapper>
  );
}

export { BrandLayout };
