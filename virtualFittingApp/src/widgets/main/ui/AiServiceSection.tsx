import styled from "styled-components";
import { PNG_HOODIE } from "@/shared";
import { BREAKPOINTS } from "@/shared";

function AiServiceSection() {
  return (
    <Wrapper>
      <GlassCard>
        <ContentLeft>
          <ToggleBox>
            <ToggleText>Let's Click!</ToggleText>
            <ToggleContainer>
              <ToggleButton />
            </ToggleContainer>
          </ToggleBox>
          <HoodieImg src={PNG_HOODIE} alt="Hoodie" />
        </ContentLeft>
        <ContentRight>
          <ProductInfo>
            <Title>BASILIUM</Title>
            <Description>BASILIUM HOODIE</Description>
            <Price>9,000₩</Price>
          </ProductInfo>
        </ContentRight>
      </GlassCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlassCard = styled.div`
  width: 960px;
  height: 600px;
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;

const ContentLeft = styled.div`
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ContentRight = styled.div`
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #f7f7f7;
  border-radius: 20px;
  margin-top: 32px;
  margin-right: 32px;
  margin-bottom: 32px;
`;

const ToggleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  gap: 8px;
`;

const ToggleContainer = styled.div`
  width: 48px;
  height: 20px;
  background-color: #ccc;
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding: 4px;
`;

const ToggleButton = styled.div`
  width: 22px;
  height: 22px;
  background-color: #fff;
  border-radius: 50%;
`;

const HoodieImg = styled.img`
  width: 100%;
  object-fit: contain;
  padding: 48px 0px;
`;

const ToggleText = styled.div`
  font-size: 24px;
  color: #fff;
  font-family: 'Suez One', serif;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #333;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Description = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
  color: #555;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

export { AiServiceSection };