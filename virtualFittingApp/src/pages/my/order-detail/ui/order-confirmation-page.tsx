import styled from 'styled-components';
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { GlassButton } from '@/shared/components/glass-button';
import { BREAKPOINTS } from '@/shared';
import { BankAccountInfoCard } from '@/entities/payment';
import { OrderInfoCard, type OrderItem } from '@/entities/order';
import { saveReviewPayload } from '@/widgets/review-list/utils/review-payload';
import { searchProducts } from '@/entities/product';
import { ShippingAddressWidget } from '@/widgets/shipping-address';
import { useOrderForm as useUserForm } from '@/entities/user';
import type { CheckoutItemDetail } from '@/shared/types/checkout';

const transformToOrderItem = (item: CheckoutItemDetail): OrderItem => ({
  productName: item.name,
  options: {
    color: item.color,
    size: item.size,
    quantity: item.quantity,
  },
  price: item.discountedPrice ?? item.price,
  id: String(item.id),
  date: new Date().toISOString(),
  brand: item.brand,
  productId: item.productId,
  productImageUrl: item.image || '',
  category: '',
});

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: isUserLoading, handleSaveAddress } = useUserForm();

  const { 
    orderId, 
    item,
    items, 
    totalAmount,
    deadline,
    senderName,
  } = location.state || {};

  const displayItems: CheckoutItemDetail[] = items && items.length > 0 ? items : (item ? [item] : []);
  const transformedItems: OrderItem[] = displayItems.map(transformToOrderItem);

   useEffect(() => {
    if (!orderId || displayItems.length === 0) {
      return;
    }

    displayItems.forEach(anItem => {
        (async () => {
        try {
            const results = await searchProducts(anItem.name);
            const first = results?.[0];
            
            const newItemPayload = {
            ...anItem,
            ...(first
                ? {
                    productId: first.productId,
                    productImageUrl: first.productPhotoUrls?.[0] ?? (anItem as any).productImageUrl,
                }
                : {}),
            };

            saveReviewPayload({
            orderId: String(orderId),
            item: newItemPayload,
            ...(deadline ? { deadline: String(deadline) } : {}),
            });
        } catch (e) {
            saveReviewPayload({
            orderId: String(orderId),
            item: anItem,
            ...(deadline ? { deadline: String(deadline) } : {}),
            });
        }
        })();
    });
  }, [orderId, items, item, deadline, displayItems]);

  return (
    <PageContainer>
      <TitleContainer>
      </TitleContainer>
      <CardContainer>
        {totalAmount && senderName && deadline && (
        <BankAccountInfoCard 
          amountToPay={totalAmount}
          senderName={senderName}
          depositDeadline={deadline}
        />
      )}
        
        {orderId && transformedItems.length > 0 && (
          <OrderInfoCard
            orderId={orderId}
            items={transformedItems}
          />
        )}
        
        {!isUserLoading && user && (
          <ShippingAddressWidget 
            user={user}
            onSaveAddress={handleSaveAddress}
          />
        )}

      </CardContainer>
      <ButtonContainer>
        <GlassButton size="medium" width="50%" onClick={() => navigate('/mypage/order')}>
          주문 내역 보기
        </GlassButton>
        <GlassButton size="medium" width="50%" onClick={() => navigate('/products')}>
          쇼핑 계속하기
        </GlassButton>
      </ButtonContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: 100%;
  max-width: 800px; 
  margin: 40px auto;
  padding: 0 20px;
  color: #fff;
  z-index: 1;
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  text-align: left;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 600px; 
  margin: 40px auto 0;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    flex-direction: column;
  }
`;