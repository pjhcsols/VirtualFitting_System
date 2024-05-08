import React, { useState, useEffect } from "react";
import Header_Store from "../components/Header_Store";
import './StoreDetailPage.css';
import heartIcon from '../assets/img/white_heart.png';
import shareIcon from '../assets/img/share.png';

const StoreDetailPage =() => {

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showColorOption, setShowColorOption] = useState(false);
    const [showSizeOption, setShowSizeOption] = useState(false);

    const colors = ['Black', 'White', 'Blue'];
    const sizes = ['S', 'M', 'L'];
    const pricePerItem = 45000;
  
    const totalPrice = selectedOptions.reduce(
        (total, option) => total + option.quantity * pricePerItem,
        0
      );

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setShowColorOption(false);
      };
    
      const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setShowSizeOption(false);
      };

      const updateSelectedOptions = () => {
        if (selectedColor && selectedSize) {
          const newOption = {
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            totalPrice: quantity * pricePerItem,
          };
          setSelectedOptions([...selectedOptions, newOption]);
          // 선택 초기화
          setSelectedColor('');
          setSelectedSize('');
          setQuantity(1);
        }
      };

      useEffect(() => {
        if (selectedColor && selectedSize) {
          updateSelectedOptions();
        }
      }, [selectedColor, selectedSize]);
    
      const increaseQuantity = (index) => {
        const newOptions = selectedOptions.map((option, idx) =>
          index === idx ? { ...option, quantity: option.quantity + 1, totalPrice: (option.quantity + 1) * pricePerItem } : option
        );
        setSelectedOptions(newOptions);
      };
    
      const decreaseQuantity = (index) => {
        const newOptions = selectedOptions.map((option, idx) =>
          index === idx
            ? {
                ...option,
                quantity: option.quantity - 1 >= 1 ? option.quantity - 1 : 1, totalPrice: (option.quantity - 1 >= 1 ? option.quantity - 1 : 1) * pricePerItem,
              }
            : option
        );
        setSelectedOptions(newOptions);
      };

      const handleColorClick = () => {
        setShowColorOption(!showColorOption);
      };

      const removeOption = (index) => {
        const newOptions = selectedOptions.filter((_, idx) => idx !== index);
        setSelectedOptions(newOptions);
      };
    

    return (
        <div className="storeDetailPage">
            <Header_Store />
            <div className="purchaseFrame">
                <div className="productImg"></div>
                <div className="productDetail_container">
                    <div className="productDetail_titleContainer">
                        <div className="productDetail_title">클래식 B 주르핏 티셔츠</div>
                        <div className="productDetail_price">{pricePerItem}원</div>
                    </div>
                    <div className="productDetail_detailContainer">
                        <div className="productDetail_descriptionContainer">
                        <div className="productDetail_description">
                            <div>클래식한 티셔츠</div>
                            <div>넉넉한 오버핏으로 레이어드시 한겨울에도 착용하기 좋습니다</div>
                        </div>
                        <div className="productDetail_size">
                            <div>size</div>
                            <div>cm단면 기준으로 측정 방법에 따라 1~3cm 오차 발생할 수 있습니다</div>
                            <div>어깨 나그랑 / 팔 나그랑 / 가슴 70 / 총장 132</div>
                        </div>
                        <div className="productDetail_material">
                            <p>Poly 100%</p>
                        </div>
                        </div>
                        <div className="productDetail_iconContainer">
                            <img className='storedetail_heart-icon' src={heartIcon} alt='heartIcon'/>
                            <img className='storedetail_share-icon' src={shareIcon} alt='shareIcon'/>
                        </div>
                    </div>
                    <div className="productDetail_deliveryContainer">
                        <div className="productDetail_deliveryTitle">Delivery Info</div>
                        <div className="productDetail_releaseDate">출고예정일</div>
                        <div className="productDetail_deliveryInfo">배송정보</div>
                    </div>
                    <div className="productDetail_optionContainer">
                        <div className="productDetail_optionsHeader">
                            <div className="productDetail_optionTitle">Option</div>
                            <div className="productDetail_toggleContainer">
                                <div className="productDetail_toggleBar" onClick={handleColorClick}> {">color"} {selectedColor}</div>
                                {showColorOption && (
                            <div className="productDetail_colorOptions">
                                {colors.map((color) => (
                                    <div key={color} onClick={() => handleColorSelect(color)}>
                                        {color}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedColor && (
                            <div className="productDetail_sizeOptions">
                                <div className="productDetail_toggleBar" onClick={() => setShowSizeOption(!showSizeOption)}>
                                    {">size"} {selectedSize}
                                </div>
                                {showSizeOption && (
                                    <div>
                                        {sizes.map((size) => (
                                            <div key={size} onClick={() => handleSizeSelect(size)}>
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                            </div>
                        </div>
                        {selectedOptions.map((option, index) => (
                            <div className="productDetail_selectedOptions" key={index}>
                                <div>
                                    <div>클래식 B 주르핏 티셔츠</div>
                                    <div>-{option.color}, {option.size}</div>
                                </div>
                                <div className="productDetail_numberManageContainer">
                                    {option.quantity}
                                    <div className="productDetail_numberManage">
                                        <button onClick={() => increaseQuantity(index)}>+</button>
                                        <button onClick={() => decreaseQuantity(index)}>-</button>
                                    </div>
                                </div>
                                <div>
                                    <button className="productDetail_removeOption" onClick={() => removeOption(index)}>x</button>
                                    <div className="productDetail_optionprice">{option.totalPrice.toLocaleString()}원</div>
                                </div>
                            </div>
                        ))}
                        <div className="productDetail_total">
                            Total : {totalPrice.toLocaleString()}원
                        </div>
                    </div>
                    <div className="productDetail_buttonContainer">
                        <div className="productDetail_buttons">
                            <button>BUY IT NOW</button>
                            <button>ADD TO CART</button>
                        </div>
                        <button>AI 가상 실착하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default StoreDetailPage;