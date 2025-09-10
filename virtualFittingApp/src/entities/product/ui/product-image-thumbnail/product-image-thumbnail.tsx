import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";

type ProductImageThumbnailProps = {
  imageSrc: string;
  onMouseEnter?: () => void;
};

function ProductImageThumbnail({ imageSrc, onMouseEnter }: ProductImageThumbnailProps) {
  return (
    <Container
      src={imageSrc}
      alt="small product"
      onMouseEnter={onMouseEnter}
    />
  );
}

const Container = styled.img`
  width: 48px;
  aspect-ratio: 4 / 5;
  height: auto;
  background-color: #e0e0e0;
  cursor: pointer;
  object-fit: cover;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 60px;
  }
`;

export { ProductImageThumbnail };
