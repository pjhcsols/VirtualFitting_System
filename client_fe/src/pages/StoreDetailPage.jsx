import React, { useState, useEffect } from "react";
import Header_Store from "../components/Header_Store";
import './StoreDetailPage.css';
import heartIcon from '../assets/img/white_heart.png';
import shareIcon from '../assets/img/share.png';
import { useParams } from 'react-router-dom';
import UploadImgModal from '../components/UploadImgModal';

const StoreDetailPage =() => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showColorOption, setShowColorOption] = useState(false);
    const [showSizeOption, setShowSizeOption] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [currentImageSrc, setCurrentImageSrc] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showUploadModal = () => {
      setIsModalOpen(true);
    };
  
    const closeUploadModal = () => {
      setIsModalOpen(false);
    };

    const handleImageUpload = async (userId, imageUrl) => {
      // AI 서버로 전송
      const photosToSend = {
        userId : userId, userImg: imageUrl,
        clothImg: product.productPhotoUrl[0],
      };
  
      try {
        const aiServerResponse = await fetch('http://172.30.1.59:9090/receive_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(photosToSend),
        });
  
        if (!aiServerResponse.ok) {
          throw new Error('AI 서버로 데이터를 전송하는 데 실패했습니다.');
        }
  
        // AI 서버로부터 응답 받음
        const blob = await aiServerResponse.blob();
        const aiImageUrl = URL.createObjectURL(blob);
        setImageSrc(aiImageUrl);
  
        setCurrentImageSrc(aiImageUrl);
  
        console.log('AI 서버 응답으로 받은 이미지 URL:', aiImageUrl);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (product && product.productPhotoUrl.length > 0) {
        setCurrentImageSrc(product.productPhotoUrl[0]);
      }
    }, [product]);
    
    const [pricePerItem, setPricePerItem] = useState(0);
    const colors = ['Black', 'White', 'Blue'];
    const sizes = ['S', 'M', 'L'];

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

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://218.233.221.41:8080/products/${productId}`);
            if (!response.ok) {
              throw new Error('데이터를 불러올 수 없습니다.');
            }
            const data = await response.json();
            setProduct(data);
            setPricePerItem(data.productPrice);
          } catch (error) {
            setError(error.message);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, [productId]);
    
      if (isLoading) return <div>로딩 중...</div>;
      if (error) return <div>에러: {error}</div>;
      if (!product) return <div>상품 정보가 없습니다.</div>;
    
      const handleVirtualTryOn = async () => {
        try {
          // localStorage에서 사용자 ID를 검색
          const userId = localStorage.getItem('user_id');
          console.log(userId);
          if (!userId) {
            throw new Error('localStorage에서 사용자 ID를 찾을 수 없습니다.');
          }
            
          const formData = new URLSearchParams();
          formData.append('userId', userId);
      
          // 서버로 요청을 보냄
          const userPhotoResponse = await fetch('http://218.233.221.41:8080/User/getImageUrl', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded', // 헤더에 Content-Type을 application/x-www-form-urlencoded로 설정
            },
            body: formData // FormData 객체를 요청 본문으로 사용
          });
          if (!userPhotoResponse.ok) {
            throw new Error('사용자 사진 URL을 가져오는 데 실패했습니다.');
          }

          const userimageUrl = await userPhotoResponse.text();

          if (userimageUrl) {
            const useExistingImage = window.confirm('기존의 이미지를 사용하시겠습니까?');
            if (!useExistingImage) {
              showUploadModal(); // 사용자 사진을 업로드할 수 있는 모달창을 띄우는 함수
              return; // 함수를 여기서 종료시킴
            }
            // 사용자가 '예'를 선택한 경우, 아래 로직을 계속 진행
          } else {
              showUploadModal(); // 사용자 사진을 업로드할 수 있는 모달창을 띄우는 함수
              return; // 함수를 여기서 종료시킴
          }

          const photosToSend = { userId : userId,
                                 userImg : userimageUrl, 
                                 clothImg : product.productPhotoUrl[0]} ;
          console.log(photosToSend);


          
          // AI 서버로 전송
          const aiServerResponse = await fetch('http://172.30.1.59:9090/receive_data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(photosToSend)
          });
  
          if (!aiServerResponse.ok) {
            throw new Error('AI 서버로 데이터를 전송하는 데 실패했습니다.');
          }
  
          // AI 서버로부터 응답 받음
          const blob = await aiServerResponse.blob();
          const aiImageUrl = URL.createObjectURL(blob);
          setImageSrc(aiImageUrl);

          setCurrentImageSrc(aiImageUrl);
      
          console.log('AI 서버 응답으로 받은 이미지 URL:', aiImageUrl);

          //AI서버에서 사진전송완료 이후 삭제 요청을 위한 응답메세지 전송
          const acknowledgeResponse = await fetch('http://172.30.1.59:9090/acknowledge_receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        });

        if (!acknowledgeResponse.ok) {
            throw new Error('이미지 삭제 요청이 실패했습니다.');
        }

        console.log('이미지 삭제 요청이 성공했습니다.');

        } catch (error) {
          console.error(error);
        }
      
      };

      const copyCurrentURL = async () => {
        try {
          // 현재 페이지의 URL을 클립보드에 복사
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 클립보드에 복사되었습니다.");
        } catch (err) {
          console.error("이 페이지의 링크를 복사하는데 실패했습니다.", err);
          alert("링크 복사에 실패했습니다.");
        }
      };
      

    return (
        <div className="storeDetailPage">
            <Header_Store />
            <div className="purchaseFrame">
                <img className="productImg" src={currentImageSrc} alt="제품 사진" />
                <div className="productDetail_container">
                    <div className="productDetail_titleContainer">
                        <div className="productDetail_title">{product.productName}</div>
                        <div className="productDetail_price">{pricePerItem}원</div>
                    </div>
                    <div className="productDetail_detailContainer">
                        <div className="productDetail_descriptionContainer">
                        <div className="productDetail_description">
                            <div>{product.productDesc}</div>
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
                            <img className='storedetail_share-icon' src={shareIcon} alt='shareIcon' onClick={copyCurrentURL}/>
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
                        <button onClick={handleVirtualTryOn}>AI 가상 실착하기</button>
                        <UploadImgModal isOpen={isModalOpen} onClose={closeUploadModal} onUpload={handleImageUpload}/>
                    </div>
                </div>
            </div>
            <div>
              <div className="storeDetailPage_select">
                  <div className="storeDetailPage_selectTitle">상세정보</div>
              </div>
              <div className="storeDetailPage_Imgcontainer">
                <img className="storeDetailPage_detailImg" src={product.productSubPhotoUrl} alt="상세 정보"></img>
              </div>
            </div>
        </div>
    )
};

export default StoreDetailPage;


/*
        const userPhotoResponse = await fetch('http://218.233.221.41:8080/User/getImageUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId })
        });
        if (!userPhotoResponse.ok) {
          throw new Error('사용자 사진 URL을 가져오는 데 실패했습니다.');
        }

        const userimageUrl = await userPhotoResponse.text();
        console.log(userimageUrl)
          

          // 결과 처리 (예: 사진 URL을 콘솔에 출력)
          const photosToSend = [userId, userimageUrl, product.productPhotoUrl[0]];
          console.log(photosToSend);*/