import React from "react";
import Header_Store from "../components/Header_Store";
import './StorePage.css';
import heartIcon from '../assets/img/Heart.png';
import { useNavigate } from 'react-router-dom';


const products = Array.from({ length: 16 }).map((_, index) => ({
    id: index,
    title: 'Crown Silver Hoodie (Black)',
    price: '72,000 won',
    description: '은색 빛의 무드한 후드티',
  }));

  const Product = ({ product, onClick }) => (

    <div className="store_product" onClick={onClick}>
      <div className="product-image"></div>
      <div className="product-actions">
        <img className='store_heart-icon' src={heartIcon} alt='heartIcon'/>
        <button className="store_cart-icon">+cart</button>
      </div>
      <div className="icon_underline"></div>
      <p className="product_title">{product.title}</p>
      <p className="product_price">{product.price}</p>
      <p className="description">{product.description}</p>
    </div>
  );


function StorePage() {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/storeDetail');
  }

    return (
        <div className="storePage">
            <Header_Store />
            <div className="store_mainImg"></div>
            <div className="horizontal-line"></div> 
            <div className="new-arrival">
                <span>New Arrival</span> 
                <div className="underline"></div>
            </div>
            <div className="products-container">
                {products.map(product => (
                <Product onClick={handleClick} key={product.id} product={product} />
                ))}
            </div>
        </div>
        

    )
}

export default StorePage;