import styled from "styled-components";
import { md } from "@/shared";

function ProductSmallCard() {
  return <ProductSmallCardContainer />;
}

const ProductSmallCardContainer = styled.img`
  width: 64px;
  aspect-ratio: 4 / 5;
  height: auto;
  background-color: #e0e0e0;
  cursor: pointer;
  object-fit: contain;

  @media (max-width: ${md}px) {
    width: 60px;
  }
`;

export { ProductSmallCard };