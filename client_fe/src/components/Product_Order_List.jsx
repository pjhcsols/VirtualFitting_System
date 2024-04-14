import {React, useState} from "react";
import "./Product_Order_List.css";
import product from '../assets/img/product.svg';

const Product_Order_List = (props) => {
    const productList = props.orderData;

    const isEmpty = productList.length === 0;

    return (
        <div className="order_list_container">
            <div className="header_div">
                <h2 className="order_list_title">주문 내역 조회</h2>
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
                <tbody>
                    {productList.map((product, index) => (
                        <tr key={index}>
                            <td>
                                <div className="image_div">
                                    <img className={product.photoUrl ? "image2" : "image1"} src={product.photoUrl ? product.photoUrl : product} alt="product"/>
                                </div>
                                <span style={{ wordWrap: 'break-word' }}>
                                    {product.productName}
                                </span>
                            </td>
                            <td>{product.creationTime}</td>
                            <td>{product.price * product.totalCnt}원</td>
                            <td>배송중</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
                
        </div>
    );
}

export default Product_Order_List;
