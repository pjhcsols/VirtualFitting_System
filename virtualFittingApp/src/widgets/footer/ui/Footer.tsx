import styled from "styled-components";
import { useEffect, useState } from "react";
import awardAiIcon from "@/assets/awards/award-ai-icon-color.svg";
import awardWebIcon from "@/assets/awards/award-web-icon-color.svg";
import { type FooterInfo, getFooterInfo } from "@/shared/api/footer.api";

function Footer() {
  const [footerData, setFooterData] = useState<FooterInfo>({
    firmName: "",
    firmAddress: "",
    businessRegistration: "",
  });

  useEffect(() => {
    const fetchFooter = async () => {
      const res = await getFooterInfo();
      if (res) setFooterData(res.data);
    };
    fetchFooter();
  }, []);

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
          <InfoText>{footerData.firmName}</InfoText>
          <Separator>|</Separator>

          <InfoText>사업자등록번호 : {footerData.businessRegistration}</InfoText>
          <Separator>|</Separator>

          <InfoText>주소 : {footerData.firmAddress}</InfoText>
          <Separator>|</Separator>

          <InfoText>통신판매업 : </InfoText>
          <FooterLink as="button" onClick={() => {}}>
            상세보기
          </FooterLink>
        </InfoBlock>

        <MedalIconsContainer>
          <MedalIcon src={awardWebIcon} alt="Web award icon" />
          <MedalIcon src={awardAiIcon} alt="AI award icon" />
        </MedalIconsContainer>
        <Copyright>© 2026 BASILIUM. All rights reserved.</Copyright>
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
