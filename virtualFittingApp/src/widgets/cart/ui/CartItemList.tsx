import styled from "styled-components";
import type { CartItem } from "@/shared";
import { useRecoilState } from 'recoil';
import { cartState } from '@/entities';

function groupByBrand(items: CartItem[]) {
  const brandMap = new Map<string, CartItem[]>();
  items.forEach((item) => {
    if (!brandMap.has(item.brand)) {
      brandMap.set(item.brand, []);
    }
    brandMap.get(item.brand)!.push(item);
  });
  return brandMap;
}

function CartItemList() {
  const [cartItems, setCartItems] = useRecoilState(cartState);

  const handleRemoveItem = (itemIdToRemove: string) => {
    setCartItems((prevItems) => 
      prevItems.filter(item => item.id !== itemIdToRemove)
    );
  };

  const groupedItems = groupByBrand(cartItems);
  const entries = [...groupedItems.entries()];

  if (cartItems.length === 0) {
    return (
      <Wrapper>
        <ItemTitle>장바구니</ItemTitle>
        <EmptyMessage>장바구니가 비어있습니다.</EmptyMessage>
      </Wrapper>
    );
  }
  
  return (
    <Wrapper>
      <ItemContainer>
        <ItemTitle>장바구니</ItemTitle>
      </ItemContainer>
      {entries.map(([brand, items], brandIndex, brandArr) => (
        <BrandSection key={brand}>
          <BrandTitle>{brand}</BrandTitle>
          {items.map((item) => (
            <CartItemRow key={item.id}>
              <CartItemImageContainer>
                <CartItemImage src={item.image} alt={item.name} />
              </CartItemImageContainer>
              <CartItemContent>
                <ItemName>{item.name}</ItemName>
                <ItemInfo>
                  {item.color} · {item.size} / {item.quantity}개
                </ItemInfo>
                <ItemPrice>
                  {item.discountedPrice ? (
                    <PriceGroup>
                      <DiscountPrice>{(item.discountedPrice * item.quantity).toLocaleString()}원</DiscountPrice>
                      <OriginalPriceBox>
                        <OriginalPrice>{(item.price * item.quantity).toLocaleString()}원</OriginalPrice>
                        <DiscountRate>{item.discountRate}%</DiscountRate>
                      </OriginalPriceBox>
                    </PriceGroup> ) : (
                  <Price>{(item.price * item.quantity).toLocaleString()}원</Price>)}
                </ItemPrice>
              </CartItemContent>
              <RemoveButton onClick={() => handleRemoveItem(item.id)}>×</RemoveButton>
            </CartItemRow>
          ))}
          {brandIndex !== brandArr.length - 1 && <BrandDivider />}
        </BrandSection>
      ))}
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
`;

const ItemTitle = styled.div`
  font-family: "pretendard";
  font-size: 22px;
  font-weight: 600;
  color: black;
  padding-bottom: 16px;
`;

const BrandSection = styled.div`
  padding-top: 4px;
`;

const BrandTitle = styled.h2`
  font-family: "pretendard";
  font-size: 16px;
  font-weight: 700;
  color: #222;
  text-align: left;
`;

const BrandDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e4e4e4;
  margin: 4px 0;
`;

const EmptyMessage = styled.div`
  font-family: "pretendard";
  font-size: 16px;
  color: #666;
  margin-top: 16px;
`;

const CartItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const CartItemImageContainer = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 0;
  margin-left: 0;
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
  color: black;
  font-family: "pretendard";
`;

const Price = styled.div`
  font-family: "pretendard";
  color: black;
  font-size: 14px;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountPrice = styled.div`
  font-family: "pretendard";
  font-size: 14px;
  color: black;
`;

const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OriginalPrice = styled.div`
  font-family: "pretendard";
  font-size: 14px;
  color: gray;
  text-decoration: line-through;
`;

const DiscountRate = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  color: white;
  padding: 0px 2px;
  background-color: red;
`;

const CartItemRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding-bottom: 24px;
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer
  padding: 4px;
  line-height: 1;

  &:hover {
    color: #000;
  }
`;

export { CartItemList };