import React from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const Payment = ({ userInfo, selectedProducts, type}) => {


    const handlePayment = async () => {
        if (!Array.isArray(selectedProducts)) {
            console.error("selectedProducts is not an array:", selectedProducts);
            return;
        }

        const jwtToken = localStorage.getItem("login-token");
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        };

        try {
            // Fetch user details
            const response = await axios.get("http://155.230.43.12:8090/normalUser/user/detail", config);
            const user = response.data.user;
            console.log("hello world", user)
            const currentTime = new Date();
            const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60 * 1000);

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}${month}${day}${hours}${minutes}${seconds}`;
            };

            const from = formatDate(currentTime);
            const to = formatDate(tenMinutesLater);
            const orderId = `order_no_${new Date().getTime()}`;

            // Concatenate all product names
            const productNames = selectedProducts.map(product => product.productName).join(', ');

            console.log("Selected Products for Payment:", selectedProducts);

            window.IMP.init("imp14418114");
            window.IMP.request_pay(
                {
                    pg: "html5_inicis.INIpayTest",
                    pay_method: "card",
                    merchant_uid: orderId,
                    name: `주문명: ${productNames}`,
                    amount: selectedProducts.reduce((total, product) => total + (product.price * product.totalCnt), 0),
                    buyer_email: user.emailAddress,
                    buyer_name: user.name,
                    buyer_tel: user.phoneNumber,
                    buyer_addr: userInfo ? userInfo.deliveryInfo.defaultDeliveryAddress : user.address,
                    buyer_postcode: userInfo ? userInfo.postcode : "기본 우편번호",
                    escrow: true,
                    vbank_due: to,
                    bypass: {
                        acceptmethod: "noeasypay",
                        P_RESERVED: "noeasypay=Y",
                        acceptmethod: "cardpoint",
                        P_RESERVED: "cp_yn=Y",
                    },
                    period: {
                        from: from,
                        to: to,
                    },
                },
                async (rsp) => {
                    console.log(rsp);
                    if (rsp.success) {
                        try {
                            // Process payment confirmation and order handling
                            await axios.post(`http://218.233.221.147:8080/normalUser/order/payment/${rsp.imp_uid}`, {
                                memberId: user.userId,
                                orderId: orderId,
                                price: rsp.paid_amount,
                                inventoryList: selectedProducts.map(product => ({
                                    productId: product.productId,
                                    color: product.color,
                                    size: product.size,
                                    cnt: product.totalCnt
                                })),
                            }, config);
                            
                            if(type != "single"){
                            await Promise.all(
                                selectedProducts.map(product => 
                                    axios.delete(`http://155.230.43.12:8090/normalUser/shopping/list?shoppingListId=${product.shoppingCartId}`, {
                                        headers: {
                                            Authorization: `Bearer ${jwtToken}`
                                        }
                                    })
                                )
                            );
                            
                        }
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: user.name + "님! 결제가 성공했습니다 :)",
                            showConfirmButton: false,
                            timer: 3000
                            }).then(() => {
                                // 페이지 새로고침
                                window.location.reload();
                            });
                            window.location.reload();
                        } catch (error) {
                            console.error("Error completing payment or deleting products:", error);
                        }
                    } else {
                        console.error("Payment failed:", rsp.error_msg);
                        Swal.fire({
                            icon: "error",
                            title: "결제 실패",
                            text: user.name + "님 결제를 실패하셨어요 ㅠㅠ!",
                          });
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    return <button 
        className={type === "single" ? "" : "shopping_list_button"} // "single"이 아닌 경우에만 "shopping_list_button" 클래스 적용
        onClick={handlePayment}
    >{type === "single" ? "BUY IT NOW" : "구매하기"}
    </button>
};

export default Payment;
