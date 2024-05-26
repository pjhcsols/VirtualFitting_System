import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderStore from "../components/Header_Store";
import './StorePage.css';
import heartIcon from '../assets/img/Heart.png';
import { useNavigate } from 'react-router-dom';

const Product = ({ product, onClick }) => {
    /*
    const handleHeartIconClick = async (e) => {
        
        e.stopPropagation(); // 상위로의 이벤트 전파 방지
        try {
            const response = await fetch(`http://218.233.221.41:8080/normalUser/shopping/list`, {
                method: 'GET', // GET 메소드 사용
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 여기에_토큰_값'
                }
            });

            if (!response.ok) {
                throw new Error('서버로부터 응답을 받지 못했습니다.');
            }
            
            const data = await response.json();
            console.log(data); // 응답 로깅
        } catch (error) {
            console.error("하트 아이콘 클릭 처리 중 오류 발생:", error);
        }
    }; onClick={handleHeartIconClick}*/

    return (
        <div className="store_product" onClick={onClick}>
            <img className="product-image" src={product.productPhotoUrl[0]} alt="제품 사진" />
            <div className="product-actions">
                <img className='store_heart-icon' src={heartIcon} alt='heartIcon' />
                <button className="store_cart-icon">+cart</button>
            </div>
            <div className="icon_underline"></div>
            <p className="product_title">{product.productName}</p>
            <p className="product_price">{product.productPrice} won</p>
            <p className="description">{product.productDesc}</p>
        </div>
    );
};

function StorePage() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category || "New Arrival";


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/products/getAll');
        const data = await response.json();
        setProducts(data.sort((a, b) => a.productId - b.productId));
      } catch (error) {
        console.error("Fetching products failed:", error);
      }
    };

    fetchProducts();
  }, []);


    const handleClick = (productId) => {
        navigate(`/storeDetail/${productId}`);
    }

    return (
        <div className="storePage">
            <HeaderStore />
            <div className="store_mainImg"></div>
            <div className="horizontal-line"></div> 
            <div className="new-arrival">
                <span>{category}</span> 
                <div className="underline"></div>
            </div>
            <div className="products-container">
                {products.map(product => (
                <Product onClick={() => handleClick(product.productId)} key={product.productId} product={product} />
                ))}
            </div>
        </div>
    )
}

export default StorePage;