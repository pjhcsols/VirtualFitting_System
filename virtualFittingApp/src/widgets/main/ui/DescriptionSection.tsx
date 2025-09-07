import styled, { keyframes } from "styled-components";
import { PNG_HOODIE, PNG_HOODIE2, PNG_HOODIE3, BREAKPOINTS } from "@/shared";

const hoodieImages = [
  { id: 1, src: PNG_HOODIE, name: "Classic Hoodie" },
  { id: 2, src: PNG_HOODIE2, name: "Street Vibe Hoodie" },
  { id: 3, src: PNG_HOODIE3, name: "Minimalist Hoodie" },
  { id: 4, src: PNG_HOODIE, name: "Classic Hoodie" },
  { id: 5, src: PNG_HOODIE2, name: "Street Vibe Hoodie" },
  { id: 6, src: PNG_HOODIE3, name: "Minimalist Hoodie" },
];

const imageTrack = [...hoodieImages, ...hoodieImages];

function DescriptionSection() {
  return (
    <Wrapper>
      <BasiliumText>BASILIUM</BasiliumText>
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
  color: white;
  text-transform: uppercase;
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
  color: #fff;
  margin: 0;
`;

export { DescriptionSection };