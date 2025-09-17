import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPaymentIntent, confirmFinalPayment } from '@/entities/payment';
import type { PaymentIntentRequest } from '@/entities/payment';

declare const TossPayments: any;
const clientKey = "test_ck_ORzdMaqN3wxZAZWjPQWgV5AkYXQG";

export const useProcessPayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const processPayment = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      setIsLoading(true);
      setError(null);

      const urlParams = new URLSearchParams(location.search);
      const paymentKey = urlParams.get('paymentKey');
      const orderId = urlParams.get('orderId');
      const amount = urlParams.get('amount');
      const paymentType = urlParams.get('paymentType');

      if (paymentKey && orderId && amount && paymentType) {
        try {
          await confirmFinalPayment({ paymentKey, orderId, amount: Number(amount), paymentType });
          alert("결제가 성공적으로 완료되었습니다.");
          navigate('/payment/success-page');
        } catch (err: any) {
          console.error("Payment confirmation failed after redirect:", err);
          setError(err);
          alert(`결제 승인 중 오류가 발생했습니다: ${err.message || "알 수 없는 오류"}`);
          navigate('/payment/fail-page');
        } finally {
          setIsLoading(false);
        }
      } else {
        const { intentInfo, paymentInfo } = location.state || {};

        if (!intentInfo || !paymentInfo) {
          alert("결제 정보가 올바르지 않습니다. 다시 시도해 주세요.");
          navigate('/');
          setIsLoading(false);
          return;
        }

        try {
          const intentResponse = await createPaymentIntent(intentInfo as PaymentIntentRequest);
          const intentData = intentResponse?.data;
          if (!intentData) throw new Error("결제 정보 확정에 실패했습니다.");

          const tossPayments = TossPayments(clientKey);
          await tossPayments.requestPayment(paymentInfo.paymentMethod, {
            amount: intentData.pgAmount,
            orderId: intentData.orderId,
            orderName: paymentInfo.orderName,
            customerName: "고객이름",
            customerEmail: "customer@example.com",
            successUrl: `${window.location.origin}/payment/success`,
            failUrl: `${window.location.origin}/payment/fail`,
          });
        } catch (err: any) {
          console.error("Payment processing failed:", err);
          setError(err);
          alert(`결제 처리 중 오류가 발생했습니다: ${err.message || "알 수 없는 오류"}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    processPayment();
  }, [location.search, navigate]);

  return { isLoading, error };
};