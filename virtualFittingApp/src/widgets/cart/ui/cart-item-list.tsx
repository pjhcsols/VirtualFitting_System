import styled from 'styled-components';
import { useState } from 'react';
import { mapCartItemResponseToCartItem, type CartItem } from '@/entities/cart';
import { GlassBox } from '@/shared/components/glass-box';
import { OrderItemCard } from '@/entities/order-item';
import { useMyCartQuery } from '@/entities/cart'; 
import { useCookies } from 'react-cookie';
import { useDeleteCartItems } from '@/features/cart';
import { UpdateCartItemOptionsPopup } from '@/features/update-cart';
import { useProductDetailQuery } from '@/entities/product'; 
import { ProductCoupon } from "@/features/product-coupon";
import type { ClaimableCoupon } from '@/entities/coupon';
import { useApplyCartItemCoupon } from "@/features/cart";

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
  const [selectedCouponMap, setSelectedCouponMap] = useState<Map<number, ClaimableCoupon | null>>(new Map());

  const { data: cartData, refetch: refetchCart } = useMyCartQuery(accessToken);
  const { mutate: deleteItems } = useDeleteCartItems({ authUserId: accessToken });
  const { mutate: applyCoupon } = useApplyCartItemCoupon({ authUserId: accessToken! });

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
    if (!accessToken) {
      alert("로그인 정보가 유효하지 않습니다.");
      return;
    }

    if (confirm("정말로 이 상품을 장바구니에서 삭제하시겠습니까?")) {
      deleteItems({ itemIds: [itemIdToRemove] }, {
        onSuccess: () => {
          console.log(`장바구니 항목 ${itemIdToRemove} 삭제 성공`);
          refetchCart();
        },
        onError: () => {
          alert("항목 삭제 중 오류가 발생했습니다.");
        }
      });
    }
  };

  const handleCouponSelect = (coupon: ClaimableCoupon | null, itemId: number) => {
    setSelectedCouponMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(itemId, coupon);
      return newMap;
    });

    if (!accessToken) {
      alert("로그인 정보가 유효하지 않습니다.");
      return;
    }

    const couponWalletIdToApply = coupon ? coupon.walletId : null; 

    applyCoupon({ itemId, couponWalletId: couponWalletIdToApply }, {
      onSuccess: () => {
        console.log(`장바구니 아이템 ID ${itemId} 쿠폰 적용/취소 성공`);
        refetchCart();
      },
      onError: () => {
        alert('쿠폰 적용에 실패했습니다. 다시 시도해 주세요.');
      }
    });
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
              {items.map((item) => {
                const itemTotalPrice = (item as any).productPrice * item.quantity; 
                const currentCoupon = selectedCouponMap.get(item.id) || null; 

                return (
                  <ItemWrapper key={item.id}>
                    <OrderItemCard item={item} />
                    
                    <ButtonContainer>
                      <ProductCoupon 
                        productId={item.productId}
                        finalPrice={itemTotalPrice} 
                        onSelect={(coupon) => handleCouponSelect(coupon, item.id)}
                        currentSelectedCoupon={currentCoupon} 
                      />
                        <EditButton onClick={() => handleEditOptions(item)}>옵션 변경</EditButton>
                    </ButtonContainer>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>×</RemoveButton>
                  </ItemWrapper>
                )
              })}
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

const ButtonContainer = styled.div`
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 100;
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