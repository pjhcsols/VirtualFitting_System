
import styled from "styled-components";

function CartItemList() {
  return (
    <Wrapper>
      <ItemContainer>
        <ItemTitle>장바구니</ItemTitle>
      </ItemContainer>
      {/* <Item></Item> */}
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

const ItemContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const ItemTitle = styled.h1`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
`;

export { CartItemList };
