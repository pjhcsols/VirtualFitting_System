import React, { useState, useEffect } from "react";
import HeaderStore from "../components/Header_Store";
import './StorePage.css';
import heartIcon from '../assets/img/Heart.png';
import { useNavigate } from 'react-router-dom';

  const Product = ({ product, onClick }) => (

    <div className="store_product" onClick={onClick}>
      <img className="product-image" src={product.productPhotoUrl[0]} alt="제품 사진" />
      <div className="product-actions">
        <img className='store_heart-icon' src={heartIcon} alt='heartIcon'/>
        <button className="store_cart-icon">+cart</button>
      </div>
      <div className="icon_underline"></div>
      <p className="product_title">{product.productName}</p>
      <p className="product_price">{product.productPrice} won</p>
      <p className="description">{product.productDesc}</p>
    </div>
  );


function StorePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://218.233.221.41:8080/products/getAll');
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
                <span>New Arrival</span> 
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