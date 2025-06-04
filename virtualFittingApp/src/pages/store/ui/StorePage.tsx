import styled from "styled-components";
import { Banner, Carousel } from "@/widgets";
import { products } from "../constants/dummy";
import { ProductCard } from "@/shared/components/product-card";
import { useNavigate } from "react-router-dom";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function StorePage() {
  const navigate = useNavigate();
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
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/store/${product.id}`)}
          />
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
  padding: 5em 1.5em;
  gap: 0;
  margin: 0 auto;
  max-width: 1000px;

  @media (min-width: ${sm}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${md}px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${xl}px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 5em 10em;
  }

  @media (min-width: ${xlDouble}px) {
    max-width: 1400px;
    padding: 5em 15em;
  }
`;

export { StorePage };
