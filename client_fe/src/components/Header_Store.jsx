import React, { useState, useEffect } from "react";
import UserImg from '../assets/img/user.png';
import CartImg from '../assets/img/Cart.png';
import CrownImg from '../assets/img/Crown.png';
import SearchImg from '../assets/img/Search.png';
import './Header_Store.css';
import { useNavigate } from "react-router-dom";
import PopUpStore from "./PopUp_Store.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Header_Store = () => {
    const { user, logout } = useAuth(); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const storedUser = localStorage.getItem('login-token');

    useEffect(() => {
        if (!storedUser) {
            setPopupOpen(false)
        }
    }, [storedUser]);

    const togglePopup = () => {
        console.log('클릭');
        setPopupOpen(!popupOpen);
    };

    const handleClick = (path, state) => {
        console.log('클릭됨');
        navigate(path, { state: { category: state } });
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
            console.log(searchText); // 현재 검색어 출력 또는 처리
            navigate('/searchResult', {state: {searchText}});
            setShowSearchBar(false);
        }
    };

    return (
        <div className="header_store">
            <div className="right-icons">
                <img style={{width: '20px', height: '20px', marginRight: '10px'}} src={CartImg} alt="cart"/>
                <img style={{width: '20px', height: '20px'}} src={UserImg} alt="user" onClick={handleUserImgClick} />
            </div>
            {popupOpen && <PopUpStore logout={togglePopup} />}
            <div className="menu_store">
                <img style={{width: '30px', height: '30px', marginLeft: '40px', marginRight: '-10px', marginTop: '-3px'}} src={CrownImg} alt="crown" onClick={() => handleClick('/', 'Home')} />
                <span className="menu-title" onClick={() => handleClick('/', 'Home')}>Basilium</span>
                <span onClick={() => handleClick('/store', 'New Arrival')}>New Arrival</span>
                <span onClick={() => handleClick('/store', 'Best 50')}>Best 50</span>
                <span onClick={() => handleClick('/store', 'Top')}>Top</span>
                <span onClick={() => handleClick('/store', 'Outer')}>Outer</span>
                <span onClick={() => handleClick('/store', 'Bottom')}>Bottom</span>
                <span onClick={() => handleClick('/store', 'Bag & Acc')}>Bag & Acc</span>
                <div onClick={toggleSearchBar}>
                    <img style={{width: '12px', height:'12px', marginRight: '3px', marginLeft: '100px'}} src={SearchImg} alt="Search" />
                    <span>Search</span>   
                </div>
                {showSearchBar && (
                        <div className={`Store_searchBarContainer ${showSearchBar ? 'active' : ''}`}
                            onClick={(e) => e.stopPropagation()}>
                            <input type="text" placeholder="검색..." 
                            value={searchText} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                        </div>
                 )}
            </div>
        </div>
    )
}

export default Header_Store;