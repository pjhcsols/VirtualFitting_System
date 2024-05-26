import React, { useState, useEffect } from "react";
import "./ShoppingCart.css";
import product from "../assets/img/product.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Payment from "./Payment"; // Import the payment component

const ShoppingCart = (props) => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);
    const [shoppingData, setShoppingData] = useState([]);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        setShoppingData(props.shoppingData);
    }, [props.shoppingData]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const jwtToken = localStorage.getItem("login-token");
            const config = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            };

            try {
                const response = await axios.get("http://localhost:8080/normalUser/user/detail", config);
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleShoppingCartPage = () => {
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

        try {
            // 배열에 있는 각 객체의 ID에 대해 개별적으로 요청을 보냄
            await Promise.all(selectedItems.map(async (index) => {
                const shoppingListId = shoppingData[index].shoppingCartId;
                console.log("Deleting item with ID:", shoppingListId);
                await axios.delete(`http://localhost:8080/normalUser/shopping/list?shoppingListId=${shoppingListId}`, {
                    headers: headers
                });
            }));
    
            // 선택된 항목들 제거
            const updatedList = shoppingData.filter(
                (_, index) => !selectedItems.includes(index)
            );
            setShoppingData(updatedList);
            setSelectedItems([]);
        } catch (error) {
            console.error("Error deleting selected items:", error);
        }
    };

    const selectedProducts = selectedItems.map(index => shoppingData[index]);
    console.log("Selected Products:", selectedProducts);

    const isEmpty = shoppingData.length === 0;

    return (
        <div>
            <div className="shopping_list_container">
                <div className="header_div">
                    <h2 className="shopping_list_title" onClick={handleShoppingCartPage}>
                        장바구니
                    </h2>
                    {userInfo && <Payment userInfo={userInfo} selectedProducts={selectedProducts} />}
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
                                        <div className="product_info">
                                            <div className="image_div">
                                                <img
                                                    className={productObj.photoUrl ? "image2" : "image1"}
                                                    src={productObj.photoUrl ? productObj.photoUrl : product}
                                                    alt="product"
                                                />
                                            </div>
                                            <div className="product_details">
                                                <span className="product_name">
                                                    {productObj.productName}
                                                </span>
                                                <br />
                                                <span className="product_specs">
                                                    {"(색상: " + productObj.color + ", 사이즈: " + productObj.size + ")"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{productObj.price}원</td>
                                    <td>{productObj.totalCnt}개</td>
                                    <td>{productObj.price * productObj.totalCnt}원</td>
                                    <td>
                                        <div className="check_wrap">
                                            <input
                                                type="checkbox"
                                                id={`check_btn_${index}`}
                                                checked={selectedItems.includes(index)}
                                                onChange={() => handleCheck(index)}
                                            />
                                            <label htmlFor={`check_btn_${index}`}></label>
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
