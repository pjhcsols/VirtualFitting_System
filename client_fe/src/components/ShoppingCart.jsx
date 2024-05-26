import React, { useState, useEffect } from "react";
import "./ShoppingCart.css";
import product from "../assets/img/product.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ShoppingCart = (props) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const [shoppingData, setShoppingData] = useState([]);

    useEffect(() => {
        setShoppingData(props.shoppingData);
    }, [props.shoppingData]);

    const handleShoppingCartPage = () => {
        // 주문 내역 페이지로 이동
        navigate("/ShoppingCartPage");
    };

    const handleCheck = (index) => {
        const selectedIndex = selectedItems.indexOf(index);
        if (selectedIndex === -1) {
            setSelectedItems([...selectedItems, index]);
        } else {
            setSelectedItems(selectedItems.filter((item) => item !== index));
        }
    };

    const handleDeleteSelected = async () => {
        const jwtToken = localStorage.getItem("login-token");
    
        const headers = {
            Authorization: `Bearer ${jwtToken}`
        };
    
        const selectedProductIds = selectedItems.map((index) => shoppingData[index].productId);
    
        try {
            await axios.delete("http://localhost:8080/normalUser/shopping/list", { 
                headers: headers,
                data: selectedProductIds 
            });
            const updatedList = shoppingData.filter(
                (_, index) => !selectedItems.includes(index)
            );
            setShoppingData(updatedList);
            setSelectedItems([]);
        } catch (error) {
            console.error("Error deleting selected items:", error);
        }
    };

    const handleBuyButton = async () => {
        const jwtToken = localStorage.getItem("login-token");
    
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        };
        
        console.log(jwtToken);
    
        try {
            const response = await axios.get("http://localhost:8080/normalUser/user/detail", config);
            console.log("유저 정보");
            console.log(response.data);
            console.log("유저 정보");

            handlePayment(null);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    async function handlePayment(orderInfo) { 
        window.IMP.init("imp14418114");
        // index.html에 iamport CDN 불러와야 사용할 수 있음
        window.IMP.request_pay({
            pg: "html5_inicis.INIpayTest", //테스트 시 html5_inicis.INIpayTest 기재
            pay_method: "card",
            merchant_uid: "order_no_0001", //상점에서 생성한 고유 주문번호
            name: "주문명:결제테스트",
            amount: 1004,
            buyer_email: "test@portone.io",
            buyer_name: "구매자이름",
            buyer_tel: "010-1234-5678", //필수 파라미터 입니다.
            buyer_addr: "서울특별시 강남구 삼성동",
            buyer_postcode: "123-456",
            escrow: true, //에스크로 결제인 경우 설정
            vbank_due: "YYYYMMDD",
            bypass: {
              acceptmethod: "noeasypay", // 간편결제 버튼을 통합결제창에서 제외(PC)
              P_RESERVED: "noeasypay=Y", // 간편결제 버튼을 통합결제창에서 제외(모바일)
              acceptmethod: "cardpoint", // 카드포인트 사용시 설정(PC)
              P_RESERVED: "cp_yn=Y", // 카드포인트 사용시 설정(모바일)
            },
            period: {
              from: "20200101", //YYYYMMDD
              to: "20201231", //YYYYMMDD
            },
          }, (rsp) => {
            console.log(rsp);
            if (rsp.success) { // 프론트에서 결제가 완료되면
                axios.post(`http://localhost:8080/api/v1/order/payment/${rsp.imp_uid}`, { 
                    memberId: orderInfo.memberId ,
                    orderId:orderInfo.orderId,
                    price : orderInfo.totalPrice,
                    inventoryIdList : orderInfo.productMgtIds
                }) // 백엔드 결제 api 호출 orderInfo.member.id
                    .then((res) => {
                        // 결제완료 
                    })
                    .catch((error) => {
                        // 에러발생시
                    });
            } else {
                // 에러발생시
            }
        });
    }
    
    

    const isEmpty = shoppingData.length === 0;

    return (
        <div>
            <div className="shopping_list_container">
                <div className="header_div">
                    <h2
                        className="shopping_list_title"
                        onClick={handleShoppingCartPage}
                    >
                        장바구니
                    </h2>
                    <button className="shopping_list_button" onClick={handleBuyButton}>결제하기</button>
                </div>
                {isEmpty ? (
                    <p>담은 물품이 없습니다.</p>
                ) : (
                    <table className="shopping_list_table">
                        <thead className="shopping_list_thead">
                            <tr>
                                <th>상품 정보</th>
                                <th>상품 금액</th>
                                <th>주문 수량</th>
                                <th>주문 금액</th>
                                <th>선택</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shoppingData.map((productObj, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="image_div">
                                            <img
                                                className={
                                                    productObj.photoUrl
                                                        ? "image2"
                                                        : "image1"
                                                }
                                                src={
                                                    productObj.photoUrl
                                                        ? productObj.photoUrl
                                                        : product
                                                }
                                                alt="product"
                                            />
                                        </div>
                                        <span
                                            style={{
                                                wordWrap: "break-word",
                                                padding: "60px",
                                            }}
                                        >
                                            {productObj.productName}
                                        </span>
                                    </td>
                                    <td>{productObj.price}원</td>
                                    <td>{productObj.totalCnt}개</td>
                                    <td>
                                        {productObj.price *
                                            productObj.totalCnt}
                                        원
                                    </td>
                                    <td>
                                        <div className="check_wrap">
                                            <input
                                                type="checkbox"
                                                id={`check_btn_${index}`}
                                                checked={selectedItems.includes(
                                                    index
                                                )}
                                                onChange={() =>
                                                    handleCheck(index)
                                                }
                                            />
                                            <label
                                                htmlFor={`check_btn_${index}`}
                                            ></label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="choose_span">
                <button onClick={handleDeleteSelected}>
                    선택 삭제
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
