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
	        <Route path="/storeDetail" element={<StoreDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;