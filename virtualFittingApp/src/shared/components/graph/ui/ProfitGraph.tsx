import styled from "styled-components";

function ProfitGraph() {
  return (
    <GraphWrapper>
      <GraphVisualArea>
        <StickContainer>
          <TextContainer>
            <SmallText>7월</SmallText>
          </TextContainer>
          <StickBox>
            <LastMonthStick />
            <ThisMonthStick />
          </StickBox>
        </StickContainer>
        <StickContainer>
          <TextContainer>
            <SmallText>7월</SmallText>
          </TextContainer>
          <StickBox>
            <LastMonthStick />
            <ThisMonthStick />
          </StickBox>
        </StickContainer>
        <StickContainer>
          <TextContainer>
            <SmallText>7월</SmallText>
          </TextContainer>
          <StickBox>
            <LastMonthStick />
            <ThisMonthStick />
          </StickBox>
        </StickContainer>
        <StickContainer>
          <TextContainer>
            <SmallText>7월</SmallText>
          </TextContainer>
          <StickBox>
            <LastMonthStick />
            <ThisMonthStick />
          </StickBox>
        </StickContainer>
        <StickContainer>
          <TextContainer>
            <SmallText>7월</SmallText>
          </TextContainer>
          <StickBox>
            <LastMonthStick />
            <ThisMonthStick />
          </StickBox>
        </StickContainer>
      </GraphVisualArea>
    </GraphWrapper>
  );
}

export { ProfitGraph };

const GraphWrapper = styled.div`
  width: 100%;
  min-width: 30rem;
  min-height: 20rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start;
`;

const GraphVisualArea = styled.div`
  box-sizing: border-box;
  padding: 0px 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 2px solid #d9d9d9;
  gap: 16px;
`;

const StickContainer = styled.div`
  min-width: 6rem;
  min-height: 10rem;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
`;

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SmallText = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  color: #4f4f4f;
`;

const StickBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const DefaultStick = styled.div`
  min-width: 2.5rem;
  min-height: 2rem;
  border-radius: 8px 8px 0px 0px;
  transition: 0.15s all ease;
  z-index: 10;
`;

const LastMonthStick = styled(DefaultStick)`
  background-color: #8b8589;
  &:hover {
    background-color: #6b6569;
  }
`;

const ThisMonthStick = styled(DefaultStick)`
  background-color: #efb042;
  &:hover {
    background-color: #ea9a10;
  }
`;
