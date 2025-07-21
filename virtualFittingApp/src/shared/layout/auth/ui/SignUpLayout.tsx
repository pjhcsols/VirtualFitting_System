import { ICON_BASILIUM_LOGO } from "@/shared/constants";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

function SignUpLayout() {
  return (
    <Wrapper>
      <LogoContainer>
        <LogoBox to={"/"}>
          <Logo src={ICON_BASILIUM_LOGO} alt="basilium-logo-icon" />
          <LogoTitle>basilium</LogoTitle>
        </LogoBox>
      </LogoContainer>
      <Outlet />
    </Wrapper>
  );
}

export { SignUpLayout };

const Wrapper = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #fffafa;
`;

const LogoContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 1rem 5rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  background-color: #fffafa;
  z-index: 100;
`;

const LogoBox = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
  overflow: hidden;
  object-fit: contain;
`;

const LogoTitle = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  text-transform: uppercase;
`;
