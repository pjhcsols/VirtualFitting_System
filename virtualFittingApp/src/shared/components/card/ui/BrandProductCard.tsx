"use client";

import { Link } from "react-router-dom";
import styled from "styled-components";

type BrandProductCardType = {
  productId: number;
  photoUrl?: string;
  productTitle: string;
  productPrice: number;
};

function BrandProductCard({
  productId,
  photoUrl,
  productTitle,
  productPrice,
}: BrandProductCardType) {
  return (
    <CardWrapper>
      <Linker to={`/products/${productId}`}>
        <Photo src={photoUrl} alt={`product-url-${productId}`} />
        <TitleBox>
          <Title>{productTitle}</Title>
        </TitleBox>
        <Price>{productPrice}</Price>
      </Linker>
    </CardWrapper>
  );
}

export { BrandProductCard };

const CardWrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  width: 100%;
  min-width: 50rem;
  min-height: 8rem;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
`;

const Linker = styled(Link)`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Photo = styled.img`
  max-width: 6rem;
  max-height: 7.5rem;
  min-width: 3rem;
  min-height: 4.25rem;
  aspect-ratio: 4/5;
  background-color: #d9d9d9;
  border-radius: 4px;
  object-fit: contain;
`;

const TitleBox = styled.div`
  min-width: 10rem;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: black;
`;

const Price = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;
