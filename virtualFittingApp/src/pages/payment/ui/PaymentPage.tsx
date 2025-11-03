import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { OrderForm } from '@/widgets/order-form';
import { ShippingAddressWidget } from '@/widgets/shipping-address';
import { PaymentSummary } from '@/widgets/payment-summary';
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon } from '@/entities/coupon';
import { calculateFinalPrice } from '@/shared/lib/price.util';
import { BREAKPOINTS } from '@/shared';
import { 
  useSingleOfflineConfirmCheckout, 
  // useSingleTossConfirmCheckout,
  PaymentSelectionModal,
} from '@/features/process-checkout';
import { useOrderForm } from '@/entities/user';

export const PaymentPage = () => {
  const location = useLocation();
  const itemToCheckout = location.state?.item as CheckoutItemDetail;
  // const { user, isLoading: isUserLoading } = useOrderForm();
  const { user, isLoading: isUserLoading, handleSaveAddress } = useOrderForm();

  const isLoggedIn = useRecoilValue(authState);
  const navigate = useNavigate();

  const [selectedCoupon, setSelectedCoupon] = useState<ClaimableCoupon | null>(null);
  // const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [paymentMethod] = useState('BANK_TRANSFER');
  // const { confirmAndPay } = useSingleTossConfirmCheckout();
  const { confirmAndProceed } = useSingleOfflineConfirmCheckout();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login');
    }
  }, [isLoggedIn, location]);


  const paymentTotals = useMemo(() => {
    if (!itemToCheckout) {
      return { productAmount: 0, finalDiscount: 0, shippingFee: 0, totalAmount: 0 };
    }
    const basePrice = itemToCheckout.discountedPrice ?? itemToCheckout.price;
    const productAmount = itemToCheckout.price * itemToCheckout.quantity;
    const finalPrice = calculateFinalPrice(basePrice, itemToCheckout.quantity, selectedCoupon);
    const finalDiscount = productAmount - finalPrice;
    const shippingFee = finalPrice >= 50000 ? 0 : 3000;
    const totalAmount = finalPrice + shippingFee;

    return { productAmount, finalDiscount, shippingFee, totalAmount };
  }, [itemToCheckout, selectedCoupon]);

  const handlePayment = () => {
    setIsModalOpen(false);
    if (!itemToCheckout || !user) return; 

    const shippingAddress = {
      name: user.name,
      address: user.address,
      phone: user.phoneNumber,
    };

    confirmAndProceed({
      item: itemToCheckout,
      coupon: selectedCoupon,
      paymentMethod: paymentMethod as any,
      finalPrice: paymentTotals.totalAmount,
      customerName: user.name,
      customerEmail: user.emailAddress,
      shippingAddress: shippingAddress,
    });
  };

  return (
    <PageContainer>
      <PageTitle>주문서</PageTitle>
      <Layout>
        <MainContent>
          <FormContainer>
            {!isUserLoading && user && (
                <ShippingAddressWidget 
                  user={user}
                  onSaveAddress={handleSaveAddress}
                />
              )}
            <OrderForm 
              item={itemToCheckout} 
              selectedCoupon={selectedCoupon}
              onSelectCoupon={setSelectedCoupon}
              finalPrice={paymentTotals.productAmount - paymentTotals.finalDiscount}
            />
          </FormContainer>
        </MainContent>
        <SideContent>
          <PaymentSummary 
            totals={paymentTotals} 
            // onConfirm={handlePayment}
            onConfirm={() => setIsModalOpen(true)}
          />
        </SideContent>
      </Layout>
      <PaymentSelectionModal 
        item={itemToCheckout}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
        totalAmount={paymentTotals.totalAmount}
        selectedCoupon={selectedCoupon}
      />
    </PageContainer>
  );
};

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
  width: 100%;
`;

const SideContent = styled.aside`
  flex: 1;
  width: 100%;
  position: sticky;
  top: 80px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;