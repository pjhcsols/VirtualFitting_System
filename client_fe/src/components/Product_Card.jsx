import React, { useState } from "react";
import "./Product_Card.css";
import like from "../assets/img/like.svg";
import OptionModal from "./OptionModal";
import Swal from 'sweetalert2';

const Product_Card = (props) => {
    const cardData = props.data;
    const isExist = cardData.photoUrl === null;
    const [showModal, setShowModal] = useState(false);

    const handleAddToCart = async (event, selectedOptions) => {
        if (!selectedOptions.color || !selectedOptions.size || !selectedOptions.quantity) {
            alert('옵션을 선택해주십시오.');
            return;
        }
        event.stopPropagation();

        const formData = new URLSearchParams();
        formData.append('size', selectedOptions.size);
        formData.append('color', selectedOptions.color);
        formData.append('amount', selectedOptions.quantity);
        console.log(formData.toString());

        try {
            const response1 = await fetch(`http://155.230.43.12:8090/normalUser/shopping/${cardData.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem("login-token")}`
                },
                body: formData.toString(),
            });
            
            const response2 = await fetch(`http://155.230.43.12:8090/normalUser/like/${cardData.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem("login-token")}`
                },

            });

            if (response1.ok && response2.ok) {
                Swal.fire({
                    position: "top-middle",
                    icon: "success",
                    title: "장바구니 추가에 성공했습니다. :)",
                    showConfirmButton: false,
                    timer: 3000
                    }).then(() => {
                        // 페이지 새로고침
                        window.location.reload();
                    });
                setShowModal(false);
            } else {
                console.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }

        
    };

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
                <button onClick={() => setShowModal(true)}>Add to Cart</button>
            </div>
            {showModal && (
                <OptionModal 
                    cardData={cardData} 
                    onClose={() => setShowModal(false)} 
                    onAddToCart={handleAddToCart} 
                />
            )}
        </div>
    );
}

export default Product_Card;
