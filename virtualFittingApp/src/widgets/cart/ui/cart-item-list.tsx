import styled from 'styled-components';
import { useState } from 'react';
import { type CartItem } from '@/entities/cart';
import { GlassBox } from '@/shared/components/glass-box';
import { GlassButton } from '@/shared/components/glass-button';
import { OrderItemCard } from '@/entities/order-item';
import { useDeleteCartItems } from '@/features/cart';
import { UpdateCartItemOptionsPopup } from '@/features/update-cart';
import { useProductDetailQuery } from '@/entities/product'; 
import type { ClaimableCoupon } from '@/entities/coupon';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import { PaymentCouponButton } from '@/features/coupon';
import { ProductCoupon } from "@/features/coupon";

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

interface CartItemListProps {
  cartItems: CartItem[];
  isCartLoading: boolean;
  selectedCouponMap: Map<number, ClaimableCoupon | null>;
  handleCouponSelect: (coupon: ClaimableCoupon | null, itemId: number) => void;
  refetchCart: () => void;
  accessToken: string;
}

export function CartItemList({
  cartItems,
  isCartLoading,
  selectedCouponMap,
  handleCouponSelect,
  refetchCart,
  accessToken,
}: CartItemListProps) {
  
  const { mutate: deleteItems } = useDeleteCartItems({ authUserId: accessToken });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ItemToEdit | null>(null);
  const [activeCouponItemId, setActiveCouponItemId] = useState<number | null>(null);

  const handleCouponSelectAndApply = (coupon: ClaimableCoupon | null, itemId: number) => {
    handleCouponSelect(coupon, itemId); 
  };

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
          refetchCart();
        },
        onError: () => {
          alert("항목 삭제 중 오류가 발생했습니다.");
        }
      });
    }
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
      {!isCartLoading && cartItems.length === 0 ? (
        <EmptyMessage>장바구니가 비어있습니다.</EmptyMessage>
      ) : (
        <ItemsContainer>
          {cartItems.length > 0 && entries.map(([brand, items],) => (
            <BrandSection key={brand}>
              {items.map((item, itemIndex) => {
                const currentCoupon = selectedCouponMap.get(item.id) || null;
                const priceForCouponCalculation = (item.discountedPrice ?? item.price) * item.quantity;
                let itemCouponDiscount = 0;
                if (currentCoupon && currentCoupon.walletId !== null) {
                  const calculatedDiscount = Math.floor(priceForCouponCalculation * (currentCoupon.percent / 100));
                  itemCouponDiscount = Math.min(calculatedDiscount, currentCoupon.maxDiscountPrice);
                }

                const finalItemPrice = priceForCouponCalculation - itemCouponDiscount;
                
                return (
                  <ItemWrapper key={item.id}>
                    <OrderItemCard 
                        item={item as CheckoutItemDetail} 
                        finalPrice={finalItemPrice} 
                    />
                    <ButtonContainer>
                      <PaymentCouponButton 
                        onClick={() => setActiveCouponItemId(item.id)}
                      />
                      {activeCouponItemId === item.id && (
                        <ProductCoupon
                          productId={item.productId}
                          finalPrice={priceForCouponCalculation}
                          pageType="product"
                          onSelect={(coupon) => {
                            handleCouponSelectAndApply(coupon, item.id);
                            setActiveCouponItemId(null);
                          }} 
                          currentSelectedCoupon={currentCoupon}
                          showPopup={true}
                          setShowPopup={() => setActiveCouponItemId(null)}
                          excludedWalletIds={[]}
                        />
                      )}
                      <GlassButton onClick={() => handleEditOptions(item)} size='small'>옵션변경</GlassButton>
                    </ButtonContainer>
                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>×</RemoveButton>
                    {itemIndex < items.length - 1 && <ItemSeparator />}
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

const ItemSeparator = styled.div`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;