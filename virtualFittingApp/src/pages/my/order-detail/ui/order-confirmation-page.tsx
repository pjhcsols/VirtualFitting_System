import styled from 'styled-components';
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { GlassButton } from '@/shared/components/glass-button';
import { BREAKPOINTS } from '@/shared';
import { BankAccountInfoCard } from '@/entities/payment';
import { OrderInfoCard } from '@/entities/order';
import { saveReviewPayload } from '@/widgets/review-list/utils/review-payload';
import { searchProducts } from '@/entities/product';
import { ShippingAddressWidget } from '@/widgets/shipping-address';
import { useOrderForm as useUserForm } from '@/entities/user';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: isUserLoading, handleSaveAddress } = useUserForm();

  const { 
    orderId, 
    item, 
    totalAmount,
    deadline,
    senderName,
  } = location.state || {};

   useEffect(() => {
    if (!orderId) {
      return;
    }

    (async () => {
      try {
        const results = await searchProducts(item.productName);
        const first = results?.[0];
        
        const addItem = {
          ...item,
          ...(first
            ? {
                productId: first.productId,
                productImageUrl: first.productPhotoUrls?.[0] ?? item.productImageUrl,
              }
            : {}),
        };

        saveReviewPayload({
          orderId: String(orderId),
          item: addItem,
          ...(deadline ? { deadline: String(deadline) } : {}),
        });
      } catch (e) {
        saveReviewPayload({
          orderId: String(orderId),
          item,
          ...(deadline ? { deadline: String(deadline) } : {}),
        });
      }
    })();
  }, [orderId, item, deadline]);

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
        {orderId && item && (
          <OrderInfoCard orderId={orderId} item={item} />
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