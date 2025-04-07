import styled from "styled-components";
import { Banner, Carousel } from "@/widgets";
import { products } from "../constants";
import { ProductCard } from "@/shared/components/product-card";

function StorePage() {
  return (
    <Wrapper>
      <CarouselContainer>
        <Carousel />
      </CarouselContainer>
      {/* <BannerContainer>
        <Banner />
      </BannerContainer> */}
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

// const BannerContainer = styled.div`
//   width: 100%;
//   height: 100vh;
// `;

const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  padding: 5em 2em;
  gap: 0;
  margin: 0 auto;
  max-width: 1000px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 5em 10em;
  }
`;


export { StorePage };
