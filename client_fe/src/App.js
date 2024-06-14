import './App.css';
import React from 'react';
import {Route, Routes, BrowserRouter} from "react-router-dom";
import MainPage from './pages/MainPage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import AboutPage from './pages/AboutPage';
import BrandPage from './pages/BrandPage';
import StoreDetailPage from './pages/StoreDetailPage';
import { AuthProvider } from './context/AuthContext';
import SignUpPageUser from './pages/SignUpPage_User';
import SignUpPageBrand from './pages/SignUpPage_Brand';
import ProfilePage from './pages/ProfilePage';
import OrderListPage from './pages/OrderListPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import NaverLogin from './API/NaverLogin';
import KaKaoLogin from './API/KakaoLogin';
import GoogleLogin from './API/GoogleLogin';
import SearchResultPage from './pages/SearchResultPage';
import ProductRegisterationPage from './pages/ProductRegisterationPage';
import Redirection from './components/Redirection';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter> 
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/Signup_User' element={<SignUpPageUser />} />
          <Route path='/Signup_Brand' element={<SignUpPageBrand />}  />
          <Route path="/MyPage" element={<MyPage />} />
	        <Route path="/storeDetail/:productId" element={<StoreDetailPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/OrderListPage" element={<OrderListPage />} />
          <Route path="/ShoppingCartPage" element={<ShoppingCartPage />} />
          <Route path="/kakaoLogin" element={<KaKaoLogin />} />
          <Route path="/naverLogin" element={<NaverLogin />} />
          <Route path="/googleLogin" element={<GoogleLogin />} />
          <Route path="/searchResult" element={<SearchResultPage />} />
          <Route path="/productRegisteration" element={<ProductRegisterationPage />} />
          <Route path="/oauth/kakao/callback" element={<Redirection />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;