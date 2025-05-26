import styled from "styled-components";

function ProductSmallCard() {
  return <Wrapper />;
}

const Wrapper = styled.img`
  width: 72px;
  height: 86px;
  aspect-ratio: 4 / 5;
  height: auto;
  background-color: #e0e0e0;
  cursor: pointer;
  object-fit: contain;
`;

export { ProductSmallCard };