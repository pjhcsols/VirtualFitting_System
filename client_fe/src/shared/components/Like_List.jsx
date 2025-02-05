import React from "react";
import "./Like_List.css";
import like from '../assets/img/like.svg';
import Product_Card from "./Product_Card"

const Like_List = (props) => {
    const productList = props.likeData;

    console.log(productList);
    console.log(productList.length === 0);

    const isEmpty = productList.length === 0;
    console.log(isEmpty);

    return (
        <div className="like_list_container">
            <div className="header_div">
                <img className = "like" src={like}/>
                <h2 className="like_list_title">좋아요</h2>
            </div>
            <div className="product-card-container">
                {isEmpty ? (
                    <p>담은 물품이 없습니다.</p>
                ) : (
                    productList.map((product, index) => (
                        <Product_Card key={index} data={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Like_List;
