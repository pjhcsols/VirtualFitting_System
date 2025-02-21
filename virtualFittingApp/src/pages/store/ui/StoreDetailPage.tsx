import styled from "styled-components";
import { DetailDescription, ProductContainer, ReviewContent } from "@/widgets";

function StoreDetailPage() {
  return (
    <Wrapper>
      <ProductContainer />
      <Divider />
      <DetailDescription />
      <Divider />
      <ReviewContent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 40px 60px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background: #f0f0f0;
  border-radius: 1000px;
`;

export { StoreDetailPage };
