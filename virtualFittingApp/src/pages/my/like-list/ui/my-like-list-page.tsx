import { useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';

import { BREAKPOINTS } from "@/shared";
import { ProductCard } from "@/entities/product";

import { fetchOnSaleProducts } from "@/entities/product";
import type { Product } from "@/entities/product";
import { useLikedProductIdsQuery } from "@/features/product-like"; 

import { GlassBox } from "@/shared/components/glass-box";
import { GlassButton } from "@/shared/components/glass-button";


function MyLikeListPage() {
  const navigate = useNavigate();

  const { 
    likedProductIds, 
    isLoading: isLikesLoading, 
  } = useLikedProductIdsQuery();
  
  const isProductQueryEnabled = !isLikesLoading && likedProductIds.length > 0;

  const { 
    data: onSaleProducts = null, 
  } = useQuery<Product[] | null, Error>({
      queryKey: ['onSaleProductsAll'],
      queryFn: () => 
          fetchOnSaleProducts({ page: 0, size: 500, sort: "productId,asc" }), 
      enabled: isProductQueryEnabled, 
      staleTime: 1000 * 60 * 10,
  });

  const filteredProducts = useMemo(() => {
    const products = onSaleProducts || [];
    const likedProductSet = new Set(likedProductIds);
    
    return products.filter(product => 
        likedProductSet.has(product.productId)
    );
  }, [likedProductIds, onSaleProducts]);

  if (filteredProducts.length === 0) {
    return (
      <EmptyWrapper>
        <StyledGlassBox>
          <EmptyContent>
            <Message>목록에 해당하는 상품이 없습니다.</Message>
            <ButtonContainer>
              <GlassButton size="medium" onClick={() => navigate('/products')}>
                쇼핑하러 가기
              </GlassButton>
            </ButtonContainer>
          </EmptyContent>
        </StyledGlassBox>
      </EmptyWrapper>
    );
  }

  return (
    <Wrapper>
      <CarouselContainer>
      </CarouselContainer>
      <ProductGrid>
        {filteredProducts.map((product) => (
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

const StyledGlassBox = styled(GlassBox)`
  padding: 40px;
  max-width: 400px;
  text-align: center;
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
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

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  width: 100%;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 0;
  color: #ffffffff;
`;

export { MyLikeListPage };
