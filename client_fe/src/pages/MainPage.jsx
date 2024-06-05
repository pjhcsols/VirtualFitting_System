import React, { useState, useEffect } from 'react';
import HeaderBottom from '../components/Header_Bottom';
import './MainPage.css';
import rightImage from '../assets/img/right.png'
import mainImg from '../assets/img/mainImg.jpg';
import playbtn from '../assets/img/playBtn.png';
import { useNavigate } from 'react-router-dom';
import brandImg1 from '../assets/img/brandImg1.jpg';
import brandImg2 from '../assets/img/brandImg2.jpg';
import brandImg3 from '../assets/img/brandImg3.jpg';
import aiImg1 from '../assets/img/aiImg1.jpg';
import aiImg2 from '../assets/img/aiImg2.jpg';


function MainPage() {

  const navigate = useNavigate();
  const [photoUrls, setPhotoUrls] = useState([]);

  const handleClick = (path) => {
    console.log('클릭됨');
    navigate(path);
};

async function fetchProductPhotoUrls() {
  try {
      // 서버로부터 데이터 가져오기
      const response = await fetch('http://155.230.43.12:8090/normalUser/like/rank');
      if (!response.ok) {
          throw new Error('서버 응답에 실패했습니다.');
      }
      
      const data = await response.json();

      // productPhotoUrl[0] 값만 저장할 배열
      const photoUrls = [];

      // 데이터에서 productPhotoUrl[0] 값 추출
      data.forEach(item => {
          if (item.productPhotoUrl && item.productPhotoUrl.length > 0) {
              photoUrls.push(item.productPhotoUrl[0]);
          }
      });
      console.log(photoUrls);

      setPhotoUrls(photoUrls);

  } catch (error) {
      console.error('오류 발생:', error);
  }
}

useEffect(() => {
  fetchProductPhotoUrls();
}, []);

  return (
    <div>
        <HeaderBottom />
        <div className='main'>
        <div className='mainImg'>
            <img className="mainImage" src={mainImg} alt="mainImage" />
            <p className='imgText1'>BASILIUM</p>
            <p className='imgText2'>Basilium of the King and Queen casual & street brand</p>
            <button className='imgBtn' onClick={() => handleClick('/store')}>
              <img src={playbtn} alt='playbtn'/>Store
            </button>
          </div>
          <div className='bestSeller'>
            <h2>Best Seller</h2>
            <div className='bestSellerImagesContainer'>
            {photoUrls.slice(0, 5).map((url, index) => (
                <img key={index} className='bestSellerImg' src={url} alt="제품 사진"/>
              ))}
            </div>
          </div>
            <div className='mainBrand'>
                <div className='content'>
                    <h2>Casual & street brand</h2>
                    <span>The brand BASILIUM, which means "decorations of kings and queens," was expreesed<br>
                    </br>under the motto of silver ornaments worn by ancien t kings. I promise to grow further as a<br>
                    </br>brand that pursues standard and simple details without losing a fresh feeling with a new<br>
                    </br>design that combines basic silhouette with trendy and modern sensibility
                    </span>
                </div>
                <div className='brandimageContainer'>
                    <img className="image" src={brandImg1} alt="brandImage1" />
                    <img className="image" src={brandImg2} alt="brandImage2" />
                    <img className="image" src={brandImg3} alt="brandImage3" />
                </div>
                <div className='loadMore'>
                    <span onClick={() => handleClick('/about')}>Load More</span>
                    <img style={{width: '12px', height: '12px', marginLeft: '2px', marginBottom: '-3px'}} src={rightImage} alt='right'/>
                </div>
            </div>
            <div className='AIservice'>
                <div className='content'>
                    <h2>BASILIUM AI service</h2>
                </div>
                <div className='imageContainer'>
                  <div className='imageGroup'>
                      <img className="imageNew" src={aiImg1} alt="aiImage1" />
                      <div>360 view of clothes</div>
                      <div>의류를 3D로 간접 체험 가능</div>
                    </div>
                  <div className='imageGroup'>
                      <img className="imageNew" src={aiImg2} alt="aiImage2" />
                      <div>3D Modeling</div>
                      <div>자신을 3D모델로 의류 착용 가능</div>
                    </div>
                  </div>
                  <div className='loadMore'>
                    <span onClick={() => handleClick('/about')}>Load More</span>
                    <img style={{width: '12px', height: '12px', marginLeft: '2px', marginBottom: '-3px'}} src={rightImage} alt='right'/>
                  </div>
                </div>
            </div>
    </div>
  );
}

export default MainPage;

