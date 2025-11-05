import styled from 'styled-components';
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { GlassButton } from '@/shared/components/glass-button';
import { BREAKPOINTS } from '@/shared';
import { GlassBox } from '@/shared/components/glass-box';
import { ShippingAddressCard } from '@/entities/shipping-address';
import { BankAccountInfoCard } from '@/entities/payment';
import { OrderInfoCard } from '@/entities/order';

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('Location State:', location.state);
  const { 
    shippingAddress, 
    orderId, 
    item, 
    totalAmount,
    deadline,
    senderName,
  } = location.state || {};

  useEffect(() => {
    if (!orderId || !item || !deadline) return; 
    const payload = { orderId, deadline, item };

    sessionStorage.setItem(
      "reviewpayload",
      JSON.stringify({
        ...payload,
        __ts: Date.now(), 
      })
    );
  }, [orderId, item, deadline]);

  return (
    <PageContainer>
      <TitleContainer>
        {/* <PageTitle>주문이 완료되었습니다.</PageTitle>
        <PageSubtitle>
          {'아래 계좌정보로 입금해주시면 결제 완료 처리가 됩니다.'}
        </PageSubtitle> */}
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
        {shippingAddress && (
          <GlassBox>
            <Header>
              <SectionTitle>배송 정보</SectionTitle>
            </Header>
            <ShippingAddressCard {...shippingAddress} />
          </GlassBox>
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

// const PageTitle = styled.h1`
//   font-size: 32px;
//   font-weight: 700;
//   color: #eeeeee;
//   margin: 0 0 12px 0;
//   text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
// `;

// const PageSubtitle = styled.p`
//   font-size: 16px;
//   font-weight: 400;
//   color: rgba(255, 255, 255, 0.85)
//   margin: 0;
//   line-height: 1.6;
//   white-space: pre-line;
//   text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.6);
// `;

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