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
import { BREAKPOINTS } from '@/shared';
import { 
  useBatchOfflineConfirmCheckout,
  useSingleOfflineConfirmCheckout, 
  PaymentSelectionModal,
  BatchOfflineCheckoutData,
  SingleOfflineCheckoutData,
} from '@/features/process-checkout';
import { useOrderForm as useUserForm } from '@/entities/user';

const calculateItemCouponDiscount = (
    itemPriceAfterBrandDiscount: number,
    itemQuantity: number,
    coupon: ClaimableCoupon
): number => {
    const itemTotalBasePrice = itemPriceAfterBrandDiscount * itemQuantity;
    const calculatedDiscount = Math.floor(itemTotalBasePrice * (coupon.percent / 100));
    return Math.min(calculatedDiscount, coupon.maxDiscountPrice);
};

export const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const batchCheckoutData = location.state?.checkoutData as { items: CheckoutItemDetail[], finalPrice: number } | undefined;
  const singleItem = location.state?.item as CheckoutItemDetail | undefined;
  
  const isBatchCheckout = !!batchCheckoutData;
  const itemsToCheckout = useMemo(() => 
    isBatchCheckout ? batchCheckoutData.items : (singleItem ? [singleItem] : []),
    [isBatchCheckout, batchCheckoutData, singleItem]
  );

  const { user, isLoading: isUserLoading, handleSaveAddress } = useUserForm();
  const isLoggedIn = useRecoilValue(authState);
  
  const singleHook = useSingleOfflineConfirmCheckout();
  const batchHook = useBatchOfflineConfirmCheckout();

  const [selectedCouponMap, setSelectedCouponMap] = useState<Map<number, ClaimableCoupon | null>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login');
    }
    if (itemsToCheckout.length === 0) {
        navigate('/'); 
    }
  }, [isLoggedIn, navigate, itemsToCheckout]);

  const paymentTotals = useMemo(() => {
    let productAmount = 0; 
    let totalDiscountedPrice = 0; 
    let totalCouponDiscount = 0; 

    itemsToCheckout.forEach(item => {
        const itemOriginalAmount = item.price * item.quantity;
        const itemDiscountedAmount = (item.discountedPrice ?? item.price) * item.quantity;
        
        productAmount += itemOriginalAmount;
        totalDiscountedPrice += itemDiscountedAmount; 
        
        const selectedCoupon = selectedCouponMap.get(item.id);

        if (selectedCoupon && selectedCoupon.walletId !== null) {
            const couponDiscount = calculateItemCouponDiscount(
                item.discountedPrice ?? item.price,
                item.quantity,
                selectedCoupon
            );
            totalCouponDiscount += couponDiscount;
        }
    });

    const totalBrandDiscount = productAmount - totalDiscountedPrice;
    const finalProductPrice = totalDiscountedPrice - totalCouponDiscount;
    const totalDiscount = totalBrandDiscount + totalCouponDiscount;
    const shippingFee = finalProductPrice >= 50000 ? 0 : 3000;
    const finalPayableAmount = finalProductPrice + shippingFee;

    return {
        productAmount,
        totalBrandDiscount,
        totalCouponDiscount,
        finalDiscount: Math.max(0, totalDiscount), 
        shippingFee,
        totalAmount: Math.max(0, finalPayableAmount),
    };
  }, [itemsToCheckout, selectedCouponMap]);

  const handleCouponSelect = (coupon: ClaimableCoupon | null, itemId: number) => {
    setSelectedCouponMap(prevMap => {
        const newMap = new Map(prevMap);
        newMap.set(itemId, coupon);
        return newMap;
    });
  };

  const handlePayment = (selectedMethod: string) => {
    setIsModalOpen(false);
    
    if (!user || itemsToCheckout.length === 0) return; 

    const shippingAddress = {
      name: user.name,
      address: user.address,
      phone: user.phoneNumber,
    };

    const sharedCheckoutData = {
      paymentMethod: selectedMethod as "BANK_TRANSFER",
      finalPrice: paymentTotals.totalAmount,
      customerName: user.name,
      customerEmail: user.emailAddress,
      shippingAddress: shippingAddress,
    };

    if (isBatchCheckout) {
        const finalBatchData: BatchOfflineCheckoutData = {
            ...sharedCheckoutData,
            items: itemsToCheckout,
            coupons: itemsToCheckout.map(item => selectedCouponMap.get(item.id) || null),
        };
        batchHook.confirmAndProceed(finalBatchData);
    } else {
        const finalSingleData: SingleOfflineCheckoutData = {
            ...sharedCheckoutData,
            item: itemsToCheckout[0],
            coupon: selectedCouponMap.get(itemsToCheckout[0].id) || null,
        }; 
        singleHook.confirmAndProceed(finalSingleData);
    }
  };

  if (itemsToCheckout.length === 0) return <PageContainer>결제 정보를 불러올 수 없습니다.</PageContainer>;

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
              items={itemsToCheckout}
              selectedCouponMap={selectedCouponMap}
              onSelectCoupon={handleCouponSelect}
            />
          </FormContainer>
        </MainContent>
        <SideContent>
          <PaymentSummary 
            totals={paymentTotals} 
            onConfirm={() => setIsModalOpen(true)}
          />
        </SideContent>
      </Layout>
      <PaymentSelectionModal 
        item={itemsToCheckout[0]}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePayment}
        totalAmount={paymentTotals.totalAmount}
        selectedCoupon={selectedCouponMap.get(itemsToCheckout[0]?.id) || null} // Same as above
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