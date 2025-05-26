import gsap from "gsap";
import { MouseEvent, useEffect } from "react";
import styled from "styled-components";
import { AdminHeaderOptions } from "@/shared/components/header/constants";
import { ICON_BASILIUM_LOGO } from "@/shared/constants";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
  const router = useNavigate();
  useEffect(() => {
    gsap.fromTo(".header-wrapper", {}, {});
    gsap.fromTo(
      ".content-box",
      {
        y: 10,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
      },
    );
  }, []);

  const onClickOptionBox = (href: string) => {
    router(`${href}`);
  };

  return (
    <Wrapper className="header-wrapper">
      <LogoContainer>
        <Logo src={ICON_BASILIUM_LOGO} alt="admin-header-logo" />
        <LogoText>basilium</LogoText>
      </LogoContainer>
      <ContentContainer>
        {AdminHeaderOptions.map((item, key) => {
          return (
            <ContentBox
              className="content-box"
              key={key}
              onClick={() => onClickOptionBox(item.href)}
            >
              <ContentText className="content-text">{item.title}</ContentText>
            </ContentBox>
          );
        })}
      </ContentContainer>
      <CopyrightBox>
        <CopyrightText>@Copyright BASILIUM</CopyrightText>
        <CopyrightText>The right have basilium</CopyrightText>
      </CopyrightBox>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-sizing: border-box;
  padding: 80px 10px;
  width: 240px;
  height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  border: 1px solid #121212;
`;

const Logo = styled.img`
  width: 50px;
  height: 70px;
  overflow: hidden;
  object-fit: contain;
`;

const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const LogoText = styled.span`
  font-family: "Prata-Regular";
  font-size: 1.2rem;
  text-transform: uppercase;
  color: black;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-items: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const ContentBox = styled.div`
  width: 100%;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const ContentText = styled.span`
  padding: 10px 25px;
  font-size: 0.8rem;
  font-weight: 700;
  color: black;
`;

const CopyrightBox = styled.div`
  box-sizing: border-box;
  padding: 18px 10px;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const CopyrightText = styled.span`
  font-size: 0.6rem;
  font-weight: 400;
  color: gray;
`;

export { AdminHeader };
