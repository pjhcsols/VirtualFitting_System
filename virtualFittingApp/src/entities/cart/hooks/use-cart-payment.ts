import { useMyCartQuery } from './use-my-cart';
import { useCookies } from 'react-cookie'; 

interface CalculatedTotals {
  productAmount: number;
  finalDiscount: number;
  shippingFee: number;
  totalAmount: number;
}

const ASSUMED_SHIPPING_FEE = 3000; 
const DEFAULT_TOTALS: CalculatedTotals = {
    productAmount: 0,
    finalDiscount: 0,
    shippingFee: ASSUMED_SHIPPING_FEE,  // [seah] 일단 3000원 해둠
    totalAmount: ASSUMED_SHIPPING_FEE,
};


export const useCartPaymentTotals = (): { totals: CalculatedTotals , isLoading: boolean, isError: boolean } => {
  const [cookies] = useCookies(['access-token']);
  const accessToken = cookies['access-token'];

  const { data: cartData, isLoading, isError } = useMyCartQuery(accessToken); 
  
  if (isLoading || isError) {
    return { totals: DEFAULT_TOTALS, isLoading, isError };
  }
  
  if (!cartData || !cartData.totals) {
    return { totals: DEFAULT_TOTALS, isLoading: false, isError: false };
  }
  
  const { totals: apiTotals } = cartData;

  const productAmount = apiTotals.originalAmount;
  const totalDiscount = apiTotals.brandDiscountAmount + apiTotals.bestCouponDiscountAmount;
  const shippingFee = ASSUMED_SHIPPING_FEE; 
  const totalAmount = apiTotals.finalPayableAmount; 

  const calculatedTotals: CalculatedTotals = {
    productAmount: productAmount,
    finalDiscount: totalDiscount,
    shippingFee: shippingFee, 
    totalAmount: totalAmount,
  };

  return { totals: calculatedTotals, isLoading: false, isError: false };
};