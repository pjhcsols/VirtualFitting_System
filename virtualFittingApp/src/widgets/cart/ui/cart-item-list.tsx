import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { cartState, type CartItem } from '@/entities/cart';
import { GlassBox } from '@/shared/components/glass-box';
import { OrderItemCard } from '@/entities/order-item'; // ✅ OrderItemCard를 재사용합니다.

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

export function CartItemList() {
  const [cartItems, setCartItems] = useRecoilState(cartState);

  const handleRemoveItem = (itemIdToRemove: string) => {
    setCartItems((prevItems) => 
      prevItems.filter(item => item.id !== itemIdToRemove)
    );
  };

  const groupedItems = groupByBrand(cartItems);
  const entries = [...groupedItems.entries()];

  return (
    <StyledGlassBox>
      <Header>
        <SectionTitle>장바구니</SectionTitle>
      </Header>
      
      {cartItems.length === 0 ? (
        <EmptyMessage>장바구니가 비어있습니다.</EmptyMessage>
      ) : (
        <ItemsContainer>
          {entries.map(([brand, items], brandIndex, brandArr) => (
            <BrandSection key={brand}>
              {items.map((item) => (
                <ItemWrapper>
                  <OrderItemCard item={item} />
                  <RemoveButton onClick={() => handleRemoveItem(item.id)}>×</RemoveButton>
                </ItemWrapper>
              ))}
            </BrandSection>
          ))}
        </ItemsContainer>
      )}
    </StyledGlassBox>
  );
}


const StyledGlassBox = styled(GlassBox)`
  width: 100%;
  padding: 0;
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const ItemsContainer = styled.div`
`;

const BrandSection = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemWrapper = styled.div`
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const EmptyMessage = styled.p`
  padding: 4rem 1.5rem;
  text-align: center;
  color: #888;
  font-size: 1rem;
`;
