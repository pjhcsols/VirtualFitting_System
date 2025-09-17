import styled, { keyframes, css } from "styled-components";
import { HOODIE_IMAGES } from "../model/constants";

const imageTrack = [...HOODIE_IMAGES, ...HOODIE_IMAGES];

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function DescriptionSection({ shouldAnimate }: { shouldAnimate: boolean }) {
  return (
    <Wrapper>
      <BasiliumText>
        {"BASILIUM".split("").map((char, index) => (
          <Letter key={index} $delay={index * 0.1} $shouldAnimate={shouldAnimate}>
            {char}
          </Letter>
        ))}
      </BasiliumText>
      <CarouselWrapper>
        <CardTrack>
          {imageTrack.map((hoodie, index) => (
              <HoodieImg src={hoodie.src} alt={hoodie.name} key={index} />
          ))}
        </CardTrack>
      </CarouselWrapper>
      <DescriptionBox>
        <Title>casual & street brand</Title>
        <Text>
          The brand BASILIUM, which means "decorations of kings and queens," was expressed
          under the motto of silver ornaments worn by ancient kings. I promise to grow further as a
          brand that pursues standard and simple details without losing a fresh feeling with a new
          design that combines basic silhouette with trendy and modern sensibility.
        </Text>
      </DescriptionBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  align-items: center;
  gap: 3rem;
  overflow: hidden;
  padding: 5rem 2rem 2rem 2rem; 
`;

const CarouselWrapper = styled.div`
  width: 100%;
  display: flex;

  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`;

const scrollAnimation = keyframes`
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
`;

const CardTrack = styled.div`
  display: flex;
  gap: 3rem;
  animation: ${scrollAnimation} 40s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const HoodieImg = styled.img`
  width: 180px;
  height: 230px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const DescriptionBox = styled.div`
  max-width: 700px;
  text-align: center;
  color: #fff;
  padding: 0 1rem;
`;

const BasiliumText = styled.span`
  font-family: "Prata-Regular";
  font-size: 10em;;
  color: #FAF9F6;
  text-transform: uppercase;
  display: inline-block;
`;

const Letter = styled.span<{ $delay: number; $shouldAnimate: boolean }>`
  display: inline-block;
  opacity: 0;
  ${(props) =>
    props.$shouldAnimate &&
    css`
      animation: ${fadeInUp} 0.5s forwards;
      animation-delay: ${props.$delay}s;
    `}
`;

const Title = styled.h2`
  font-family: 'Inter Tight'
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  text-transform: uppercase;
`;

const Text = styled.p`
  font-family: 'Inter Tight', 'Pretendard', sans-serif;
  font-size: 1rem;
  line-height: 1.2;
  color: #FAF9F6;
  margin: 0;
`;

export { DescriptionSection };