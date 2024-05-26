import React from "react";
import "./Product_Card.css";
import like from "../assets/img/like.svg";

const Product_Card = (props) => {
    const cardData = props.data;
    const isExist = cardData.photoUrl === null;

    return (
        <div className="product-card">
            <div className="product-image">
                {isExist ? (
                    <img src={like} alt="No Image" />
                ) : (
                    <img src={cardData.productPhotoUrl[0]} alt={cardData.productName} />
                )}
            </div>
            <div className="product-details">
                <h3>{cardData.productName}</h3>
                <p>{cardData.description}</p>
                <button>Add to Cart</button>
            </div>
        </div>
    );
}

export default Product_Card;
