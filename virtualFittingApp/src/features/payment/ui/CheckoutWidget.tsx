import { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { generateOrderId } from "@/shared";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "wwXaKkcYycdO5JSA1QlWV";

export default function App() {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null)
  const [price, setPrice] = useState(50_000)

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey)

      const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
        "#payment-widget",
        price
      )

      paymentWidgetRef.current = paymentWidget
      paymentMethodsWidgetRef.current = paymentMethodsWidget
    })()
  }, [])


  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current

    if (paymentMethodsWidget == null) {
      return
    }

    paymentMethodsWidget.updateAmount(
      price,
      paymentMethodsWidget.UPDATE_REASON.COUPON
    )
  }, [price])

  return (
    <div>
      <h1>주문서</h1>
      <div id="payment-widget" />
      {/* <div>
        <input
          type="checkbox"
          onChange={(event) => {
            setPrice(event.target.checked ? price - 5_000 : price + 5_000)
          }}
        />
        <label>5,000원 할인 쿠폰 적용</label>
      </div> */}
      <button
        onClick={async () => {
          const paymentWidget = paymentWidgetRef.current

          try {
              await paymentWidget?.requestPayment({
                orderId: generateOrderId(),
                orderName: "토스 티셔츠 외 2건",
                customerName: "김토스",
                customerEmail: "customer123@gmail.com",
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`,
                })
            } catch (err) {
            console.log(err)
            }
        }}
        >
        결제하기
        </button>
    </div>
  )
}