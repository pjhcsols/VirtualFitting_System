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
            <CartItemRow key={`${item.id}-${item.color}-${item.size}`}>
              <CartItemImageContainer>
                <CartItemImage src={item.image} alt={item.name} />
              </CartItemImageContainer>
              <CartItemContent>
                <ItemName>{item.name}</ItemName>
                <ItemInfo>
                  {item.color} · {item.size} / {item.quantity}개
                </ItemInfo>
                <ItemPrice>
                  {item.price}원
                </ItemPrice>
              </CartItemContent>
            </CartItemRow>
          ))
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ItemTitle = styled.h1`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
`;

const EmptyMessage = styled.div`
  font-family: "pretendard";
  font-size: 16px;
  color: #666;
  margin-top: 1rem;
`;

const CartItemRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #e4e4e4;
  padding: 0.5rem 0;
`;

const CartItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const CartItemImageContainer = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const ItemName = styled.div`
  font-size: 14px;
  font-family: "pretendard";
  color: black;
`;

const ItemInfo = styled.div`
  font-size: 14px;
  color: #444;
  font-family: "pretendard";
`;

const ItemPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: black;
  font-family: "pretendard";
`;

export { CartItemList };
