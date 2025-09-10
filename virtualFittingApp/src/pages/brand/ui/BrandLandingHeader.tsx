import gsap from "gsap";
import { useEffect } from "react";
import styled from "styled-components";

function BrandLandingHeader() {
  useEffect(() => {
    gsap.fromTo(
      ".logo-text",
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
      },
    );
    gsap.fromTo(
      ".login-button",
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 2,
        ease: "power4.out",
      },
    );
  }, []);
  return (
    <Wrapper>
      <LogoText className="logo-text">basilium</LogoText>
      <LoginContainer>
        <LoginBtn className="login-button">
          <span className="text">LOGIN</span>
        </LoginBtn>
        <SignUpBtn className="login-button">
          <span className="text">SIGN UP</span>
        </SignUpBtn>
      </LoginContainer>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 40px 140px;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  @media (max-width: 1280px) {
    padding: 15px 120px;
  }
`;

const LogoText = styled.span`
  font-family: "Prata-Regular";
  font-size: 2rem;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const LoginBtn = styled.div`
  width: 140px;
  min-width: 140px;
  height: 50px;
  min-height: 50px;
  display: flex;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, #3d455c 0%, #8191c2 100%);
  cursor: pointer;
  .text {
    font-family: "Prata-Regular";
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    text-transform: uppercase;
  }
`;

const SignUpBtn = styled(LoginBtn)`
  background: radial-gradient(circle, #3d455c 0%, #b281c2 100%);
`;

export { BrandLandingHeader };
