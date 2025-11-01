import styled from 'styled-components';
import { useState } from 'react';
import { mapCartItemResponseToCartItem, type CartItem } from '@/entities/cart';
import { GlassBox } from '@/shared/components/glass-box';
import { OrderItemCard } from '@/entities/order-item';
import { useMyCartQuery } from '@/entities/cart'; 
import { useCookies } from 'react-cookie';
import { ProductCoupon } from '@/features/product-coupon';
import { UpdateCartItemOptionsPopup } from '@/features/update-cart';
import { useProductDetailQuery, type ProductDetail } from '@/entities/product'; 

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

interface ItemToEdit {
    item: CartItem;
}

export function CartItemList() {
  const [cookies] = useCookies(['access-token']);
  const accessToken = cookies['access-token'];

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemToEdit | null>(null);

  const { data: cartData, refetch: refetchCart } = useMyCartQuery(accessToken);
  
  const cartItems: CartItem[] = cartData?.items
    ? cartData.items.map(mapCartItemResponseToCartItem)
    : [];
    
  const productIdToFetch = itemToEdit ? itemToEdit.item.productId : null;
  const initialColorToFetch = itemToEdit ? itemToEdit.item.color : null;
  
  const { 
      data: productDetail, 
      isLoading: isProductDetailLoading,
  } = useProductDetailQuery(productIdToFetch, initialColorToFetch);

  const handleRemoveItem = (itemIdToRemove: number) => {
    // [seah] 만들어야됨 ㅜ
    console.log(itemIdToRemove);
  };

  const handleEditOptions = (item: CartItem) => {
      setItemToEdit({ item });
      setIsPopupOpen(true);
  };
  
  const handleClosePopup = () => {
      setIsPopupOpen(false);
      setItemToEdit(null);
  };
  
  const handleUpdateSuccess = () => {
      refetchCart();
  };

  const groupedItems = groupByBrand(cartItems);
  const entries = [...groupedItems.entries()];

  return (
    <>
    <StyledGlassBox>
      <Header>
        <SectionTitle>장바구니</SectionTitle>
      </Header>
      {cartItems.length === 0 ? (
        <EmptyMessage>장바구니가 비어있습니다.</EmptyMessage>
      ) : (
        <ItemsContainer>
          {entries.map(([brand, items],) => (
            <BrandSection key={brand}>
              {items.map((item) => (
                <ItemWrapper key={item.id}>
                  <OrderItemCard item={item} />
                  <EditButton onClick={() => handleEditOptions(item)}>옵션 변경</EditButton>
                  <RemoveButton onClick={() => handleRemoveItem(item.id)}>×</RemoveButton>
                </ItemWrapper>
              ))}
            </BrandSection>
          ))}
        </ItemsContainer>
      )}
    </StyledGlassBox>
    {isPopupOpen && itemToEdit && productDetail && !isProductDetailLoading && (
          <UpdateCartItemOptionsPopup
              productDetail={productDetail}
              cartItemId={itemToEdit.item.id}
              initialColor={itemToEdit.item.color}
              initialSize={itemToEdit.item.size}
              initialQuantity={itemToEdit.item.quantity}
              onClose={handleClosePopup}
              onUpdateSuccess={handleUpdateSuccess}
          />
      )}
      </>
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
  font-size: 17px;
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

const EditButton = styled.button`
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
`;