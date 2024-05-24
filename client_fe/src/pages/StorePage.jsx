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
                let url = 'http://172.20.38.185:8080/products/getAll';
                let data = [];
    
                // "New Arrival" 선택 시 모든 상품을 기본 순으로 가져온 후 역순으로 정렬
                if (category === "New Arrival") {
                    const response = await fetch(url);
                    data = await response.json();
                    data = data.sort((a, b) => b.productId - a.productId);
                } 
                // "Top", "Outer", "Bottom", "Bag & Acc" 선택 시 특정 categoryId에 따라 상품을 가져오고 역순으로 정렬
                else {
                    const categories = {
                        "Top": [1, 2, 3, 4, 5, 11, 13],
                        "Outer": [10, 11, 12],
                        "Bottom": [6, 7, 8, 9],
                        "Bag & Acc": [19]
                    };
    
                    // 선택된 category에 따른 categoryId 목록을 가져옴
                    const categoryIds = categories[category];
    
                    // 모든 categoryId에 대해 상품을 병렬로 가져옵니다.
                    const responses = await Promise.all(categoryIds.map(categoryId =>
                        fetch(`http://172.20.38.185:8080/products/category/${categoryId}`)
                    ));
    
                    // 모든 응답에서 JSON 데이터를 병렬로 추출
                    const jsonResponses = await Promise.all(responses.map(response => response.json()));
    
                    // 모든 카테고리의 상품들을 하나의 배열로 합침
                    data = jsonResponses.flat();
    
                    // productId 기준으로 역순 정렬
                    data.sort((a, b) => b.productId - a.productId);
                }
    
                setProducts(data);
            } catch (error) {
                console.error("Fetching products failed:", error);
            }
        };
    
        fetchProducts();
    }, [category]);
    


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