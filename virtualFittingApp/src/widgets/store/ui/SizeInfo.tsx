import styled from "styled-components";

function SizeInfo() {
  return (
    <Wrapper>
      <SizeInfoContainer>
        <SizeTitle>
          사이즈표
        </SizeTitle>
      </SizeInfoContainer>
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

const SizeInfoContainer = styled.div`
  padding: 100px 0px;
  display: flex;
  flex-flow: column nowrap;
`;

const SizeTitle = styled.span`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
  width: 100%;
`;


export { SizeInfo };
