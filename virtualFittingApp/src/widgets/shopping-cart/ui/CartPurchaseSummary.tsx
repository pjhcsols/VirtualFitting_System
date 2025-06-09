import { PayButton } from "@/shared";
import styled from "styled-components";
import { xlDouble, xl, lg, md, sm } from "@/shared";

function CartPurchaseSummary() {
  return (
    <Wrapper>
      <CartSummaryContainer>
        <CartSummaryTitle>
          구매정보
        </CartSummaryTitle>
        <SizeBoxBottom>
          <PayButton></PayButton>
        </SizeBoxBottom>
      </CartSummaryContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
`;

const CartSummaryContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const CartSummaryTitle = styled.span`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
  width: 100%;
  text-align: left; 
`;

const SizeBoxBottom = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 16px 0px;

  @media (max-width: ${md}px) {
    justify-content: center;
    align-items: center;
  }
`; 

export { CartPurchaseSummary };