import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { BREAKPOINTS } from "@/shared";
import { ProductCard } from "@/shared/components/product-card";
import { Carousel } from "@/widgets";

import { fetchOnSaleProducts } from "../api/products.action";
import type { Product } from "@/shared";

function StorePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchOnSaleProducts({ page: 0, size: 20, sort: "productId,desc" });
      setProducts(data);
      console.log(data);
    };
    loadProducts();
  }, []);

  return (
    <Wrapper>
      <CarouselContainer>
        <Carousel />
      </CarouselContainer>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onClick={() => navigate(`/store/${product.productId}`)}
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

  @media (min-width: ${BREAKPOINTS.sm}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${BREAKPOINTS.md}px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${BREAKPOINTS.xl}px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 5em 10em;
  }

  @media (min-width: ${BREAKPOINTS.xlDouble}px) {
    max-width: 1400px;
    padding: 5em 15em;
  }
`;

export { StorePage };
