import styled from "styled-components";

function LandingHeader() {
  return (
    <Wrapper>
      <HeaderContainer>
        <HeaderLogo>Basilium</HeaderLogo>
      </HeaderContainer>
    </Wrapper>
  );
}

export { LandingHeader };

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  z-index: 50;
  transition: 0.8s all ease-out;
`;

const HeaderContainer = styled.nav`
  padding: 8px 240px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderLogo = styled.span`
  font-family: "Prata-Regular";
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;
