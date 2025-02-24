import {React, useState} from "react";
import "./Product_Order_List.css";
import { useNavigate } from "react-router-dom";
import product from '../assets/img/product.svg';

const Product_Order_List = (props) => {

    const navigate = useNavigate();
    const handleOrderListPage = () => {
        // 주문 내역 페이지로 이동
        navigate('/OrderListPage');
    };

    const productList = props.orderData;
    const isOrderListPage = props.isOrderListPage;
    const isEmpty = productList.length === 0;

    return (
        <div className="order_list_container">
            <div className="header_div">
                <h2 className="order_list_title" onClick={handleOrderListPage}>주문 내역 조회</h2>
            </div>
            {isEmpty ? (
                <p>구매한 물품이 없습니다.</p>
            ) : (
                <table className="order_list_table">
                <thead className="order_list_thead">
                    <tr>
                        <th>상품 정보</th>
                        <th>주문 일자</th>
                        <th>상품 금액</th>
                        <th>주문 상태</th>
                    </tr>
                </thead>
                <tbody style={isOrderListPage ? { borderBottom: '2px solid black' } : null}>
                    {productList.map((product, index) => (
                        <tr key={index}>
                            <td>
                                <div className="image_div">
                                    <img className={product.photoUrl ? "image2" : "image1"} src={product.photoUrl ? product.photoUrl : product} alt="product"/>
                                </div>
                                <div className="product_details">
                                    <span className="product_name">
                                        {product.productName}
                                    </span>
                                    <br />
                                    <span className="product_specs">
                                        {"(색상: " + product.color + ", 사이즈: " + product.size + ")"}
                                    </span>
                                </div>
                            </td>
                            <td>{new Date(product.creationTime).toISOString().slice(0, 16).replace('T', ' ')}</td>
                            <td>{product.price * product.totalCnt}원</td>
                            
                            {isOrderListPage ? (
                                <td>
                                    <div>배송중</div>
                                    <button className="optional_button">배송조회</button>
                                </td>
                            ) : (
                                <td>배송중</td>
                            )}
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
                
        </div>
    );
}

export default Product_Order_List;
