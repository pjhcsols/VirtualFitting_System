import styled from "styled-components";
import { useState } from 'react';
import { BREAKPOINTS } from "@/shared";
import { CartItemList } from "@/widgets";
import { PaymentSummary } from "@/widgets/payment-summary";
import { useCartPaymentTotals } from "@/entities/cart";


function CartPage() {
  // const { totals, isLoading, isError } = useCartPaymentTotals();
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const { totals } = useCartPaymentTotals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(isModalOpen);
  // [seah] 수정 필요

  return (
    <PageContainer>
      <PageTitle>장바구니</PageTitle>
      <Layout>
        <MainContent>
          <CartItemList />
        </MainContent>
        <SideContent>
          <PaymentSummary 
            totals={totals} 
            onConfirm={() => setIsModalOpen(true)}
          />
        </SideContent>
      </Layout>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #fff;
`;

const Layout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 32px;
  
  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 2;
  min-width: 0;
  width: 100%;
`;

const SideContent = styled.aside`
  flex: 1;
  width: 100%;
  position: sticky;
  top: 80px;
`;

export { CartPage };
