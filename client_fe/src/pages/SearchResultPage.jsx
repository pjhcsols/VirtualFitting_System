import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderStore from "../components/Header_Store";
import './StorePage.css';
import './SearchResultPage.css';
import heartIcon from '../assets/img/Heart.png';
import { useNavigate } from 'react-router-dom';
import warningImg from '../assets/img/warningAlert.png';

const Product = ({ product, onClick }) => {
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

function SearchResultPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category || "New Arrival";
    const searchText = location.state?.searchText || "";
   
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = 'http://218.233.221.147:8080/products/getAll';
                let data = await fetch(url).then(response => response.json());
    
                if (searchText) {
                    data = data.filter(product =>
                        product.productName.toLowerCase().includes(searchText.toLowerCase())
                    );
                } else {
                    // 카테고리에 따라 정렬된 상품을 가져오는 부분 추가
                    // 이전과 동일하게 카테고리에 따라 상품을 가져오는 로직을 추가
                }
    
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Fetching products failed:", error);
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [category, searchText]);
    


    const handleClick = (productId) => {
        navigate(`/storeDetail/${productId}`);
    }

    return (
        <div className="searchResultPage">
            <HeaderStore />
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {!loading && products.length > 0 && (
                <div>
                    <div className="searchResult-text">
                        '<span className="search-text-highlight">{searchText}</span>'에 대한 검색결과({products.length}개)
                    </div>
                    <div className="search-horizontal-line"></div> 
                    <div className="products-container">
                        {products.map(product => (
                            <Product onClick={() => handleClick(product.productId)} key={product.productId} product={product} />
                        ))} 
                    </div>
                </div>
            )}
            {!loading && products.length === 0 && (
                <div className="no-search-result">
                    <img src={warningImg} alt="warning" className="warning-img"/>
                    검색 결과가 없습니다.<br/>
                    다른 검색어로 검색해주세요.
                </div>
            )}  
        </div>
    )
}

export default SearchResultPage;