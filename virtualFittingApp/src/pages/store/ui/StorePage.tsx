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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 2em 2em;

  @media (min-width: 768px) {
    padding: 2em 6em; /* 태블릿 이상일 때 좌우 여백 더 주기 */
  }

  @media (min-width: 1200px) {
    padding: 2em 10em; /* 데스크탑 이상일 때 더 넓게 */
  }
`;

export { StorePage };
