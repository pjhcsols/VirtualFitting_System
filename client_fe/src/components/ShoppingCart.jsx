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
                    <button className="shopping_list_button">결제하기</button>
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
