import styled from "styled-components";

function DetailDescription() {
  return (
    <Wrapper>
      <DetailContainer>
        <DetailTitle>
          상품설명
        </DetailTitle>
      </DetailContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
`;

const DetailContainer = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-flow: column nowrap;
`;

const DetailTitle = styled.span`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
  width: 100%;
`;

export { DetailDescription };
