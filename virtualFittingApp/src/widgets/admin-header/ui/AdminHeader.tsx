import { Link } from "react-router-dom";

import styled from "styled-components";
import BasiliumLogo from "/public/svg/BasiliumLogo.svg";

import { AdminHeaderOptions } from "../constants";

function AdminHeader() {
  return (
    <Wrapper>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <ContentContainer>
        {AdminHeaderOptions.map((item, key) => {
          return (
            <ContentBox key={key} to={item.href}>
              <ContentText>{item.title}</ContentText>
            </ContentBox>
          );
        })}
      </ContentContainer>
    </Wrapper>
  );
}

export { AdminHeader };

const Wrapper = styled.header`
  box-sizing: border-box;
  padding: 1rem;
  min-width: 18rem;
  min-height: 95vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #f5f6f8;
  border-radius: 1rem;
  gap: 2rem;
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
`;

const ContentContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.2rem;
`;

const ContentBox = styled(Link)`
  box-sizing: border-box;
  padding: 1rem;
  width: 100%;
  min-height: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 1rem;
  transition: 0.2s all ease;
  &:hover {
    background-color: #ffffff;
  }
`;

const ContentText = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;
