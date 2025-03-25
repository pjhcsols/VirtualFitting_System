import styled from "styled-components";

function HeroSection() {
  return (
    <Wrapper>
      <CaptionContainer>
        <UpperLineContainer>
          <BasiliumTitle>Basilium of the King and Queen</BasiliumTitle>
        </UpperLineContainer>
        <BottomLineContainer>
          <BasiliumTitle size="5rem">casual & street brand</BasiliumTitle>
        </BottomLineContainer>
      </CaptionContainer>
      <ModelingContainer>{/* <Basilium3DLogo /> */}</ModelingContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/*
 * Caption Section ( Left Side on Hero)
 */

const CaptionContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const UpperLineContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const BottomLineContainer = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BasiliumTitle = styled.span<{ size?: string }>`
  font-family: "Prata-Regular";
  font-size: ${(props) => props.size ?? "4rem"};
  font-weight: 600;
  color: white;
  @media (max-width: 1440px) {
    font-size: 2.5rem;
  }
  @media (max-width: 1024px) {
    font-size: 2.25rem;
  }
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

/*
 * 3D Modeling Section ( Right Side on Hero)
 */

const ModelingContainer = styled.div`
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { HeroSection };
