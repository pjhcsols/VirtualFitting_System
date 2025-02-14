import React from "react";
import Swal from "sweetalert2";
import { fetchUserInfo, postPayment, deleteProductFromCart } from '../api/payment.action';
import { formatDate } from '../utils/date.util';
import { IMP_KEY, PG_NAME, PAY_METHOD, ESCROW } from '../constants/index';
import { PaymentProps } from '../types/paymentProps';
import PaymentButton from '../ui/PaymentButton';

const Payment: React.FC<PaymentProps> = ({ userInfo, selectedProducts, type }) => {
  const handlePayment = async () => {
    if (!Array.isArray(selectedProducts)) {
      console.error("selectedProducts is not an array:", selectedProducts);
      return;
    }

    const jwtToken = localStorage.getItem("login-token");

    if (!jwtToken) {
      Swal.fire({
        icon: 'error',
        title: '로그인 정보가 없습니다.',
        text: '로그인이 필요합니다.',
      }).then(() => {
        window.location.href = '/login';
      });
      return;
    }

    try {
      const response = await fetchUserInfo(jwtToken);
      const user = response.user;

      const currentTime = new Date();
      const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60 * 1000);
      const from = formatDate(currentTime);
      const to = formatDate(tenMinutesLater);
      const orderId = `order_no_${new Date().getTime()}`;
      const productNames = selectedProducts.map((product) => product.productName).join(", ");

      window.IMP.init(IMP_KEY);
      window.IMP.request_pay(
        {
          pg: PG_NAME,
          pay_method: PAY_METHOD,
          merchant_uid: orderId,
          name: `주문명: ${productNames}`,
          amount: selectedProducts.reduce(
            (total, product) => total + (product.price ?? 0) * (product.totalCnt ?? 0), // 기본값 0
            0
          ),
          buyer_email: user.emailAddress,
          buyer_name: user.name,
          buyer_tel: user.phoneNumber,
          buyer_addr: userInfo?.deliveryInfo?.defaultDeliveryAddress ?? user.address,
          buyer_postcode: userInfo?.postcode ?? "기본 우편번호",
          escrow: ESCROW,
          vbank_due: to,
          bypass: {
            acceptmethod: "cardpoint",
            P_RESERVED: "cp_yn=Y",
          },
          period: {
            from: from,
            to: to,
          },
        },
        async (rsp: IMPResponse) => {
          if (rsp.success) {
            try {
              await postPayment(rsp.imp_uid, {
                memberId: user.userId,
                orderId,
                price: rsp.paid_amount,
                inventoryList: selectedProducts.map((product) => ({
                  productId: product.productId,
                  color: product.color,
                  size: product.size,
                  cnt: product.totalCnt,
                })),
              }, jwtToken);

              if (type !== "single") {
                await Promise.all(
                  selectedProducts.map((product) =>
                    deleteProductFromCart(product.shoppingCartId, jwtToken)
                  )
                );
              }

              Swal.fire({
                position: "top",
                icon: "success",
                title: `${user.name}님! 결제가 성공했습니다 :)`,
                showConfirmButton: false,
                timer: 3000,
              }).then(() => {
                window.location.reload();
              });
            } catch (error) {
              console.error("Error completing payment or deleting products:", error);
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "결제 실패",
              text: `${user.name}님 결제를 실패하셨어요 ㅠㅠ!`,
            });
          }
        }
      );
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <PaymentButton onClick={handlePayment} label={type === "single" ? "BUY IT NOW" : "구매하기"} />
  );
};

export default Payment;
