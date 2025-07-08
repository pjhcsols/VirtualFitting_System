import { NavLink } from "react-router-dom";
import styled from "styled-components";

function ProductCreateButton() {
  return (
    <ProductCreateButtonWrapper>
      <RouteWrapper to={"/brand/product/create"}>
        <Text>상품 추가하기</Text>
      </RouteWrapper>
    </ProductCreateButtonWrapper>
  );
}

export { ProductCreateButton };

const RouteWrapper = styled(NavLink)`
  text-decoration: none;
`;

const ProductCreateButtonWrapper = styled.div.attrs({
  draggable: false,
})`
  box-sizing: border-box;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: #52bae3;
  color: white;
  transition: 0.15s all ease;
  &:hover {
    background-color: #72c9eb;
    transform: scale(1.02);
  }
  &:active {
    background-color: #43b6e3;
    animation: clickEffect 0.2s ease-out;
  }
  @keyframes clickEffect {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.98);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Text = styled.span.attrs({ draggable: false })`
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
`;
