import styled from "styled-components";
import { DetailDescription, ProductContainer, ReviewContent } from "@/widgets";
import { products } from "../constants/dummy";
import { useParams } from "react-router-dom";

function StoreDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === id);

  return (
    <Wrapper>
      <ProductContainer product={product} />
      <Divider />
      <DetailDescription />
      <Divider />
      <ReviewContent />
    </Wrapper>
  );
}

const BREAKPOINT = {
  xlDouble: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
};

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 16px 48px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINT.md}px) {
    padding: 16px 5px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #f0f0f0;
  border-radius: 1000px;
`;

export { StoreDetailPage };
