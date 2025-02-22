import React, { useState, useEffect } from 'react';
import { API_BASILIUM } from "../../shared/config/AxiosConfig";
import { useNavigate } from 'react-router-dom';
import Header_Bottom from "@/shared/components/header/header-bottom/HeaderBottom";  
import './MainPage.css';

interface ProductData {
  productPhotoUrl: string[];
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const handleClick = (path: string): void => {
    console.log('클릭됨');
    navigate(path);
  };

  const fetchProductPhotoUrls = async (): Promise<void> => {
    try {
      const response = await API_BASILIUM.get('/normalUser/like/rank');
      if (response.status < 200 || response.status >= 300) {
        throw new Error('서버 응답에 실패했습니다.');
      }
      const data: ProductData[] = response.data;
      
      const photoUrls: string[] = data.map(item => item.productPhotoUrl[0]).filter(Boolean);
      console.log(photoUrls);
      setPhotoUrls(photoUrls);
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchProductPhotoUrls();
  }, []);

  return (
    <div>
      <Header_Bottom />
      <div className='main'>
      </div>
    </div>
  );
};

export default MainPage;