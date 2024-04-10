import {React, useState} from "react";
import "./Product_Order_List.css";
import product from '../assets/img/product.svg';

const Product_Order_List = (props) => {
    const productList = props.orderData;

    const [isEmpty, setIsEmpty] = useState(productList.length === 0);

    return (
        <div className="order_list_container">
            <h2 className="order_list_title">주문 내역 조회</h2>
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
                    {productList.map(product => (
                        <tr key={product.id}>
                            <td>
                                <div>
                                    <img src={product} alt="product"/>
                                </div>
                                <span style={{ wordWrap: 'break-word' }}>
                                    {product.name}
                                </span>
                            </td>
                            <td>{product.date}</td>
                            <td>{product.price}</td>
                            <td>{product.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            
            
        </div>
    );
}

export default Product_Order_List;
