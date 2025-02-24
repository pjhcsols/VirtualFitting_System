import React, { useState, useEffect } from 'react';
import SearchImage from '../assets/img/Search.png';
import { useNavigate } from 'react-router-dom';
import CrownImage from '../assets/img/Crown.png';
import './Header_Bottom.css';
import cartIcon from '../assets/img/Cart.png';  
import MYIcon from '../assets/img/MY.png';
import PopUpBottom from './PopUp_Bottom.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Swal from "sweetalert2";

const Header_Bottom = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const { user, logout, login, loading } = useAuth();
    const storedUser = localStorage.getItem('login-token');

    useEffect(() => {
        if (!storedUser) {
            setPopupOpen(false);
        }
    }, [storedUser]);

    const handleClick = (path) => {
        console.log('클릭됨');
        navigate(path);
    };

    const handleCartClick = (path) => {
        console.log("클릭됨");
        if (storedUser) {
            navigate(path);
        }
        else {
            Swal.fire({
                title: '로그인 후 이용가능합니다!',
                icon: 'warning',
                confirmButtonColor: '#000',
                confirmButtonText: '확인',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
        }
    }

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const handleUserImgClick = () => {
        if (localStorage.getItem('login-token')) {
            togglePopup();
        } else {
            navigate('/login');
        }
    };

    // 검색바 표시 상태를 관리하는 상태 변수와 setter 함수
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchText, setSearchText] = useState('');

    // 검색바 표시 상태를 토글하는 함수
    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    const handleInputChange = (e) => {
        setSearchText(e.target.value); // 입력되는 텍스트로 상태 업데이트
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { // 엔터키를 누를 경우
            navigate('/searchResult', {state: {searchText}});
            setShowSearchBar(false);
            setSearchText('');
        }
    };

    return (
        <div className='header_Bottom'>
            <div className='menu_Bottom'>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/about')}>About</span>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/brand')}>Brand</span>
                <img style={{ width: '40px', height: '40px', marginLeft: '100px', marginRight: '100px', cursor: 'pointer' }} src={CrownImage} alt="crown" onClick={() => handleClick('/')} />
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick("/store")}>Store</span>
                <div onClick={toggleSearchBar}>
                    <img style={{ width: '15px', height: '15px', marginRight: '-95px', marginLeft: '100px', cursor: 'pointer' }} src={SearchImage} alt="search" />
                    <span style={{ position: 'relative', top: '-2px' }}>Search</span>
                    {showSearchBar && (
                        <div className={`searchBarContainer ${showSearchBar ? 'active' : ''}`}
                            onClick={(e) => e.stopPropagation()}>
                            <input type="text" placeholder="검색..."
                                value={searchText} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                        </div>
                    )}
                </div>
            </div>
            <div className='iconContainer'>
                <img className='cartIcon' src={cartIcon} alt='cartIcon' style={{ cursor: 'pointer' }} onClick={() => handleCartClick('/mypage?section=shoppingCart')}/>
                <img className='MyIcon' src={MYIcon} alt='MYIcon' onClick={handleUserImgClick} style={{ cursor: 'pointer' }} />
                {popupOpen && <PopUpBottom logout={logout} />}
            </div>
        </div>
    );
}

export default Header_Bottom;
