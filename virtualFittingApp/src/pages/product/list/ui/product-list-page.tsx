import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { BREAKPOINTS } from "@/shared";
import { ProductCard } from "@/entities/product";
import { AdvertisementCarousel } from "@/widgets/advertisement-carousel";

import { fetchOnSaleProducts } from "@/entities/product";
import type { Product } from "@/entities/product";

function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchOnSaleProducts({ page: 0, size: 20, sort: "productId,desc" });
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) {
    return <LoadingIndicator>Loading products...</LoadingIndicator>;
  }

  return (
    <Wrapper>
      <CarouselContainer>
        <AdvertisementCarousel />
      </CarouselContainer>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onClick={() => navigate(`/products/${product.productId}`)}
          />
        ))}
      </ProductGrid>
    </Wrapper>
  );
}

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #888;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
`;

const CarouselContainer = styled.div`
  width: 100%;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 40px 20px;
  gap: 16px;
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

export { ProductListPage };
