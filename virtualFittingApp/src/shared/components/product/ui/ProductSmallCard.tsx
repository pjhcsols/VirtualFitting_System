import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";

function ProductSmallCard({ imageSrc }: { imageSrc: string }) {
  return <ProductSmallCardContainer src={imageSrc} alt="small product" />;
}

const ProductSmallCardContainer = styled.img`
  width: 48px;
  aspect-ratio: 4 / 5;
  height: auto;
  background-color: #e0e0e0;
  cursor: pointer;
  object-fit: contain;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 60px;
  }
`;

export { ProductSmallCard };
