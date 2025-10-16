import styled from "styled-components";
import React from "react";

const businessInfo = [
  "바실리움(BASILIUM)",
  "대표자 : 박한솔",
  "사업자등록번호 : 872-25-01125",
  "주소 : 대구광역시 달서구 한실로6길 123",
  "통신판매업 : 2022-대구달서-0162",
];

function Footer() {
  const openPopup = (url: string, title: string) => {
    const width = 600;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      url,
      title,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <Wrapper>
      <Content>
        <Links>
          <FooterLink as="button" onClick={() => openPopup('/terms', '전자상거래 표준약관')}>
            전자상거래 표준약관
          </FooterLink>
          <FooterLink as="button" onClick={() => openPopup('/privacy', '개인정보 처리방침')}>
            개인정보 처리방침
          </FooterLink>
        </Links>
        <InfoBlock>
          {businessInfo.map((info, index) => (
            <React.Fragment key={index}>
              <InfoText>{info}</InfoText>
              {index < businessInfo.length - 1 && <Separator>|</Separator>}
            </React.Fragment>
          ))}
        </InfoBlock>
        <Copyright>© 2025 BASILIUM. All rights reserved.</Copyright>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  width: 100%;
  color: #888;
  font-size: 13px;
  z-index: 50;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Links = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  padding: 16px;
`;

const FooterLink = styled.a`
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const InfoBlock = styled.div`
  line-height: 1.6;
  word-break: keep-all; 
`;

const InfoText = styled.span`
  color: #ccc;
  display: inline;
`;

const Separator = styled.span`
  margin: 0 0.75em;
  color: #888;
`;

const Copyright = styled.p`
  margin-top: 50px;
  margin-bottom: 30px;
  font-size: 12px;
  color: #ccc;
`;

export { Footer };