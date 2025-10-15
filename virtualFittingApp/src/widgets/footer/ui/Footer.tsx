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
  return (
    <Wrapper>
      <Content>
        <Links>
          <FooterLink href="/terms" target="_blank">전자상거래 표준약관</FooterLink>
          <FooterLink href="/privacy" target="_blank">개인정보 처리방침</FooterLink>
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
  padding: 70px 50px;
  color: #888;
  font-size: 13px;
  z-index: 50;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Links = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 8px;
`;

const FooterLink = styled.a`
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

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
  margin-top: 24px;
  font-size: 12px;
  color: #ccc;
`;

export { Footer };