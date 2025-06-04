import styled from "styled-components";
import { DetailDescription, SizeInfo, ProductContainer, ReviewContent } from "@/widgets";
import { products } from "../constants/dummy";
import { useParams } from "react-router-dom";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function StoreDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => String(p.id) === id);

  return (
    <Wrapper>
      <ProductContainer product={product} />
      <Divider></Divider>
      <DetailDescription />
      <SizeInfo />
      <ReviewContent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 16px 0px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  @media (max-width: ${md}px) {
    padding: 16px 16px;
  }
`;

const Divider = styled.div`
  margin-top: 64px;
  width: 100%;
  height: 1px;
  background: #e4e4e4;
  border-radius: 1000px;
`;

export { StoreDetailPage };
