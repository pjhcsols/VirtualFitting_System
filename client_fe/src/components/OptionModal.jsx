import React, { useState } from "react";
import "./OptionModal.css";

const OptionModal = ({ cardData, onClose, onAddToCart }) => {
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = () => {
        const selectedOptions = {
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
        };
        onAddToCart(new Event('submit'), selectedOptions);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>옵션 선택</h2>
                <div className="modal-content">
                    <div className="modal-option">
                        <label>색상:</label>
                        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                            <option value="">Select Color</option>
                            {cardData.productColor && cardData.productColor.map((color, index) => (
                                <option key={index} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-option">
                        <label>사이즈:</label>
                        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                            <option value="">Select Size</option>
                            {cardData.productSize && cardData.productSize.map((size, index) => (
                                <option key={index} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-option">
                        <label>수량:</label>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            min="1"
                        />
                    </div>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose}>취소</button>
                    <button onClick={handleSubmit}>추가</button>
                </div>
            </div>
        </div>
    );
}

export default OptionModal;
