import styled from "styled-components";
import { useState } from "react";
import awardAiIcon from "@/assets/awards/award-ai-icon-color.svg";
import awardWebIcon from "@/assets/awards/award-web-icon-color.svg";
import { validateBusiness } from "@/pages/auth/api/business.action";

const businessData = {
  name: "바실리움(BASILIUM)",
  regNo: "872-25-01125",
  address: "서울특별시 강남구 역삼로 555",
  mailOrder: "2022-대구달서-0162",
};

function Footer() {
  const [isValidating, setIsValidating] = useState(false);

  const handleVerify = async () => {
    if (isValidating) return;
    
    setIsValidating(true);
    const pureNumber = businessData.regNo.replace(/-/g, "");
    
    const result = await validateBusiness(pureNumber);
    
    if (result) {
      alert("국세청에 등록된 정상 사업자입니다.");
    } else {
      alert("유효하지 않은 사업자 번호이거나 확인이 불가능합니다.");
    }
    setIsValidating(false);
  };

  const openPopup = (url: string, title: string) => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

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
          <FooterLink as="button" onClick={() => openPopup("/terms", "전자상거래 표준약관")}>
            전자상거래 표준약관
          </FooterLink>
          <FooterLink as="button" onClick={() => openPopup("/privacy", "개인정보 처리방침")}>
            개인정보 처리방침
          </FooterLink>
        </Links>

        <InfoBlock>
          <InfoText>{businessData.name}</InfoText>
          <Separator>|</Separator>
          
          <VerifyButton onClick={handleVerify} disabled={isValidating}>
            사업자등록번호 : {businessData.regNo} 
          </VerifyButton>
          
          <Separator>|</Separator>
          <InfoText>주소 : {businessData.address}</InfoText>
          <Separator>|</Separator>
          <InfoText>통신판매업 : {businessData.mailOrder}</InfoText>
        </InfoBlock>

        <MedalIconsContainer>
          <MedalIcon src={awardWebIcon} alt="Web award icon" />
          <MedalIcon src={awardAiIcon} alt="AI award icon" />
        </MedalIconsContainer>
        <Copyright>© 2025 BASILIUM. All rights reserved.</Copyright>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  width: 100%;
  color: #fff;
  font-size: 13px;
  z-index: 50;
  margin-top: auto;
  text-align: center;
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

const FooterLink = styled.button`
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: #b8d2ff;
    text-decoration: underline;
  }
`;

const InfoBlock = styled.div`
  line-height: 1.6;
  word-break: keep-all;
`;

const InfoText = styled.span`
  color: #fff;
`;

const VerifyButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: #b8d2ff;
  }
  
  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`;

const Separator = styled.span`
  margin: 0 0.75em;
  color: #fff;
`;

const MedalIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
`;

const MedalIcon = styled.img`
  height: 40px;
  width: auto;
`;

const Copyright = styled.p`
  margin-bottom: 30px;
  font-size: 12px;
  color: #fff;
`;

export { Footer };
