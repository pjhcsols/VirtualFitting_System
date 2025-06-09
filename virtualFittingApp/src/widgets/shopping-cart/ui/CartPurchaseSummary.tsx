import styled from "styled-components";

function CartPurchaseSummary() {
  return (
    <Wrapper>
      <CartSummaryContainer>
        <CartSummaryTitle>
          구매정보
        </CartSummaryTitle>
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
`;

export { CartPurchaseSummary };