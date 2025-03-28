import { Basilium3DLogo } from "@/shared";
import gsap from "gsap";
import styled from "styled-components";

function HeroSection() {
  const tl = gsap.timeline();

  tl.fromTo(
    ".upper-text",
    {
      y: -100,
    },
    {
      y: 0,
      duration: 1,
      ease: "power4.out",
    },
  );
  tl.fromTo(
    "lower-text",
    {
      y: 100,
    },
    {
      y: 0,
      duration: 0.6,
      ease: "power4.out",
    },
  );

  return (
    <Wrapper>
      <CaptionContainer>
        <UpperLineContainer>
          <TitleContainer>
            <BasiliumTitle className="upper-text">
              The King and Queen
            </BasiliumTitle>
          </TitleContainer>
        </UpperLineContainer>
        <BottomLineContainer>
          <TitleContainer>
            <BasiliumTitle size="5rem" className="lower-text">
              casual & street brand
            </BasiliumTitle>
          </TitleContainer>
        </BottomLineContainer>
      </CaptionContainer>
      <ModelingContainer className="3D-model">
        <Basilium3DLogo />
      </ModelingContainer>
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

const TitleContainer = styled.div`
  width: 100%;
  height: fit-content;
  overflow: hidden;
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
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

export { HeroSection };
