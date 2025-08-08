import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { handlePaymentResponse } from "@/features/payment/api/payment.action";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const orderId = searchParams.get("orderId") ?? "";
  const paymentKey = searchParams.get("paymentKey") ?? "";
  const amount = searchParams.get("amount") ?? "";

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId || !paymentKey) {
        setError("결제 정보가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        const resultMessage = await handlePaymentResponse({ 
          taskId: orderId,
        //   paymentKey,
          success: true,
        });

        setSuccess(true);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderId, paymentKey]);

  if (loading) return <div>결제 승인 중입니다...</div>;
  if (error) return <div>오류: {error}</div>;
  if (success) {
    return (
      <div>
        <h1>결제 성공</h1>
        <div>{`주문 아이디: ${orderId}`}</div>
        <div>{`결제 금액: ${Number(amount).toLocaleString()}원`}</div>
      </div>
    );
  }

  return <div>결제 승인 실패</div>;
}
