import styled from "styled-components";
import { Banner, Carousel } from "@/widgets";

function StorePage() {
  return (
    <Wrapper>
      <CarouselContainer>
        <Carousel />
      </CarouselContainer>
      <BannerContainer>
        <Banner />
      </BannerContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export { StorePage };
