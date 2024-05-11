import React from "react";
import "./ShoppingCart.css";
import product from "../assets/img/product.svg";

const ShoppingCart = (props) => {
    const productList = props.shoppingData;

    const isEmpty = productList.length === 0;

    return (
        <div>
        <div className="shopping_list_container">
            <div className="header_div">
                <h2 className="shopping_list_title">장바구니</h2>
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
                        {productList.map((productObj, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="image_div">
                                        <img className={productObj.photoUrl ? "image2" : "image1"} src={productObj.photoUrl ? productObj.photoUrl : product} alt="product"/>
                                    </div>
                                    <span style={{ wordWrap: 'break-word', padding: '60px'}}>
                                        {productObj.productName}
                                    </span>
                                </td>
                                <td>{productObj.price}원</td>
                                <td>{productObj.totalCnt}개</td>
                                <td>{productObj.price * productObj.totalCnt}원</td>
                                <td>
                                    <div className="check_wrap">
                                        <input type="checkbox" id={`check_btn_${index}`} />
                                        <label htmlFor={`check_btn_${index}`}></label>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        <div className="choose_span">선택 삭제</div>
        </div>
    
    );
}

export default ShoppingCart;
