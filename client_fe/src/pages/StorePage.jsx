import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeaderStore from "../components/Header_Store";
import './StorePage.css';
import FullheartIcon from '../assets/img/Heart.png';
import EmptyheartIcon from '../assets/img/Empty_heart.png';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';


Modal.setAppElement('#root'); 

const Product = ({ product, onClick }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [productOptions, setProductOptions] = useState({ sizes: [], colors: [] }); // 제품 옵션 상태 관리
    const [selectedOptions, setSelectedOptions] = useState({ size: '', color: '', amount: 1 });
    
    const jwtToken = localStorage.getItem("login-token");

    useEffect(() => {
        const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || {};
        setIsLiked(likedProducts[product.productId] || false);
    }, [product.productId]);

    function openModal(event) {
        if (event) event.stopPropagation(); 
        setIsOpen(true);
    }

    // 모달 닫기
    function closeModal(event) {
        if (event) event.stopPropagation(); 
        setIsOpen(false);
    }

    useEffect(() => {
        const fetchProductOptions = async () => {
            const response = await fetch(`http://155.230.43.12:8090/products/${product.productId}`);
            const data = await response.json();
            setProductOptions({ sizes: data.productSize, colors: data.productColor });
            setSelectedOptions({ size: data.productSize[0], color: data.productColor[0], amount: 1 });
        };
        fetchProductOptions();
    }, [product.productId]);


    const handleCartClick = async (event) => {
        event.stopPropagation();
        openModal(); // 장바구니 클릭 시 모달 열기
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedOptions(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleHeartClick = async (event, productId) => {
        event.stopPropagation(); // 이벤트 버블링 방지
        console.log(jwtToken);
        try {
            const response = await fetch(`http://155.230.43.12:8090/normalUser/like/${productId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                },
            });

            if (response.ok) {
                console.log('Product liked successfully');
                setIsLiked(!isLiked);

                const likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || {};
                likedProducts[productId] = !isLiked;
                localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
                
            } else {
                console.error('Failed to like product');
            }
        } catch (error) {
            console.error('Error liking product:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.stopPropagation();
    
        // URLSearchParams를 사용하여 selectedOptions 객체를 URL-encoded form 데이터로 변환
        const formData = new URLSearchParams();
        formData.append('size', selectedOptions.size);
        formData.append('color', selectedOptions.color);
        formData.append('amount', selectedOptions.amount);
        console.log(formData.toString());
    
        try {
            const response = await fetch(`http://155.230.43.12:8090/normalUser/shopping/${product.productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData.toString(), // URLSearchParams 객체를 문자열로 변환하여 body에 설정
            });
    
            if (response.ok) {
                alert('상품이 장바구니에 추가되었습니다');
                closeModal(); // 성공 시 모달 닫기
            } else {
                console.error('Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };
    


    const heartIcon = isLiked ? FullheartIcon : EmptyheartIcon ;

    return (
        <div className="store_product">
            <img className="product-image" src={product.productPhotoUrl[0]} alt="제품 사진" onClick={(event) => onClick(event, product.productId)}/>
            <div className="product-actions">
                <img className='store_heart-icon' src={heartIcon} alt='heartIcon' onClick={(event) => handleHeartClick(event, product.productId)}/>
                <button className="store_cart-icon" onClick={handleCartClick}>+cart</button>
            {/* 상품 모달 */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modalContent" overlayClassName="modalOverlay" contentLabel="상품 옵션 선택">
                <span className="uploadImgModal-close" onClick={closeModal}>&times;</span>
                <div className="uploadImgModal-title">상품 옵션 선택</div>
                <div className="productModal">
                <div>
                    <div>Size</div>
                    <select name="size" value={selectedOptions.size} onChange={handleChange}>
                        {productOptions.sizes.map((size, index) => (
                            <option key={index} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div>Color</div>
                    <select name="color" value={selectedOptions.color} onChange={handleChange}>
                        {productOptions.colors.map((color, index) => (
                            <option key={index} value={color}>{color}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <div>Amount</div>
                    <input type="number" name="amount" value={selectedOptions.amount} onChange={handleChange} min="1" />
                </div>
                </div>
                <button onClick={handleSubmit}>확인</button>
            </Modal>
            </div>
            <div className="icon_underline" onClick={(event) => onClick(event, product.productId)}></div>
            <p className="product_title" onClick={(event) => onClick(event, product.productId)}>{product.productName}</p>
            <p className="product_price" onClick={(event) => onClick(event, product.productId)}>{product.productPrice} won</p>
            <p className="description" onClick={(event) => onClick(event, product.productId)}>{product.productDesc}</p>
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
                let url = 'http://155.230.43.12:8090/products/getAll';
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
                        "Top": [1, 2, 3, 4, 5, 13], 
                        "Outer": [10, 11, 12],
                        "Bottom": [6, 7, 8, 9],
                        "Bag & Acc": [19],
                        "T-shirts" : [1],
                        "long sleeves" : [2], 
                        "blouse" : [3], 
                        "knitwear" : [4], 
                        "hood" : [5], 
                        "vest" : [13],
                        "jacket" : [10], 
                        "cardigan" : [11], 
                        "padding" : [12],
                        "jeans" : [6], 
                        "slacks" : [7], 
                        "shorts" : [8], 
                        "skirt" : [9],
                        "accessories" : [19]
                    };
    
                    // 선택된 category에 따른 categoryId 목록을 가져옴
                    const categoryIds = categories[category];   
    
                    // 모든 categoryId에 대해 상품을 병렬로 가져옵니다.
                    const responses = await Promise.all(categoryIds.map(categoryId =>
                        fetch(`http://155.230.43.12:8090/products/category/${categoryId}`)
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