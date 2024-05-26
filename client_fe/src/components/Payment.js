import React from "react";
import axios from "axios";

const Payment = ({ userInfo, selectedProducts}) => {

    console.log("hahahahahah", selectedProducts);
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
            const response = await axios.get("http://localhost:8080/normalUser/user/detail", config);
            const user = response.data.user;

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
                    amount: 100,//selectedProducts.reduce((total, product) => total + (product.price * product.totalCnt), 0),
                    buyer_email: user.emailAddress,
                    buyer_name: user.name,
                    buyer_tel: user.phoneNumber,
                    buyer_addr: userInfo.deliveryInfo.defaultDeliveryAddress,
                    buyer_postcode: userInfo.postcode,
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
                            await axios.post(`http://localhost:8080/normalUser/order/payment/${rsp.imp_uid}`, {
                                memberId: userInfo.userNumber,
                                orderId: orderId,
                                price: rsp.paid_amount,
                                inventoryList: selectedProducts.map(product => ({
                                    productId: product.productId,
                                    color: product.color,
                                    size: product.size,
                                    cnt: product.totalCnt
                                })),
                            }, config);

                            await Promise.all(
                                selectedProducts.map(product => 
                                    axios.delete(`http://localhost:8080/normalUser/shopping/list?shoppingListId=${product.shoppingCartId}`, {
                                        headers: {
                                            Authorization: `Bearer ${jwtToken}`
                                        }
                                    })
                                )
                            );
                            

                            // Reload the page after successful payment and deletion
                            window.location.reload();
                        } catch (error) {
                            console.error("Error completing payment or deleting products:", error);
                        }
                    } else {
                        console.error("Payment failed:", rsp.error_msg);
                    }
                }
            );
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    return <button className="shopping_list_button" onClick={handlePayment}>결제하기</button>;
};

export default Payment;