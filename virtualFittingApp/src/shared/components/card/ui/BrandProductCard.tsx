import styled from "styled-components";

function BrandProductCard() {
  return (
    <CardWrapper>
      <Photo></Photo>
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
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
`;

const Photo = styled.img`
  min-width: 5rem;
  min-height: 6.25rem;
  aspect-ratio: 4/5;
  object-fit: contain;
`;
