import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import BasiliumLogo from "/public/svg/BasiliumLogo.svg";

function AdminHeader() {
  const router = useNavigate();

  const onClickHome = () => {
    router("/admin");
  };

  return (
    <Wrapper>
      <ContentContainer>
        <ContentBox to={"/admin/user"}>
          <ContentText>USER</ContentText>
        </ContentBox>
        <ContentBox to={"/admin/brand"}>
          <ContentText>BRAND</ContentText>
        </ContentBox>
      </ContentContainer>
      <LogoContainer>
        <Logo onClick={onClickHome} />
      </LogoContainer>
      <ContentContainer>
        <ContentBox to={"/admin/banner"}>
          <ContentText>BANNER</ContentText>
        </ContentBox>
        <ContentBox to={"/admin/product"}>
          <ContentText>Product</ContentText>
        </ContentBox>
      </ContentContainer>
    </Wrapper>
  );
}

export { AdminHeader };

const Wrapper = styled.header`
  box-sizing: border-box;
  padding: 0 8rem;
  width: 100vw;
  min-height: 80px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: transparent;
  gap: 2rem;
  border-bottom: 1px solid #d9d9d9;
`;

const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img.attrs({ src: BasiliumLogo, alt: "basilium-logo" })`
  width: 3rem;
  height: 3rem;
  object-fit: contain;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
`;

const ContentBox = styled(Link)`
  box-sizing: border-box;
  padding: 1rem;
  width: 160px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  transition: 0.2s all ease;
`;

const ContentText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;
