import React, { useState } from 'react';
import HeaderBottom from '../components/Header_Bottom';
import './MainPage.css';
import rightImage from '../assets/img/right.png'
import mainImg from '../assets/img/mainImg.jpg';
import playbtn from '../assets/img/playBtn.png';
import { useNavigate } from 'react-router-dom';


function MainPage() {

  const navigate = useNavigate();

  const handleClick = (path) => {
    console.log('클릭됨');
    navigate(path);
};

  return (
    <div>
        <HeaderBottom />
        <div className='main'>
        <div className='mainImg'>
            <img src={mainImg} alt="mainImage" />
            <p className='imgText1'>BASILIUM</p>
            <p className='imgText2'>Basilium of the King and Queen casual & street brand</p>
            <button className='imgBtn' onClick={() => handleClick('/store')}>
              <img src={playbtn} alt='playbtn'/>Store
            </button>
          </div>
          <div className='bestSeller'>
            <h2>Best Seller</h2>
            <div className='bestSellerImagesContainer'>
              <div className='bestSellerImg'></div>
              <div className='bestSellerImg'></div>
              <div className='bestSellerImg'></div>
              <div className='bestSellerImg'></div>
              <div className='bestSellerImg'></div>
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
                    <div className='image'></div>
                    <div className='image'></div>
                    <div className='image'></div>
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
                    <div className='imageNew'></div>
                      <div>360 view of clothes</div>
                      <div>의류를 3D로 간접 체험 가능</div>
                    </div>
                  <div className='imageGroup'>
                    <div className='imageNew'></div>
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

