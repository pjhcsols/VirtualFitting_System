import styled from "styled-components";

function ProductSmallCard() {
  return <Wrapper />;
}

const Wrapper = styled.div`
  width: 72px;
  height: 86px;
  background-color: #e0e0e0; /* 연한 회색 */
  cursor: pointer;
`;

export { ProductSmallCard };