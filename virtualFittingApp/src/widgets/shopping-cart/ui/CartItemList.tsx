import styled from "styled-components";
import type { CartItem } from "@/shared";

type CartItemListProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

function CartItemList({ cartItems, setCartItems }: CartItemListProps) {
  return (
    <Wrapper>
      <ItemContainer>
        <ItemTitle>장바구니</ItemTitle>
      </ItemContainer>
        {cartItems.length === 0 ? (
          <EmptyMessage>장바구니가 비어있습니다.</EmptyMessage>
        ) : (
          cartItems
            .filter((item): item is CartItem => item != null)
            .map((item) => (
              <Item key={item.id}>
                <ItemName>{item.name}</ItemName>
                <ItemDetails>
                  색상: {item.color}, 사이즈: {item.size}, 수량: {item.quantity}
                </ItemDetails>
              </Item>
            ))
        )}
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
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h1`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  display: block;
`;

const EmptyMessage = styled.div`
  font-family: "pretendard";
  font-size: 16px;
  color: #666;
  margin-top: 1rem;
`;

const Item = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  width: 100%;
`;

const ItemName = styled.div`
  font-weight: 600;
  font-size: 18px;
`;

const ItemDetails = styled.div`
  font-size: 14px;
  color: #444;
`;

export { CartItemList };
