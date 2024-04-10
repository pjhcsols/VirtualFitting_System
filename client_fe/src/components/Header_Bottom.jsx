import React, { useState, useRef, useEffect } from 'react';
import SearchImage from '../assets/img/Search.png';
import { useNavigate } from 'react-router-dom';
import CrownImage from '../assets/img/Crown.png';
import './Header_Bottom.css';
import cartIcon from '../assets/img/Cart.png';
import MYIcon from '../assets/img/MY.png';

const Header_Bottom = () => {
        const navigate = useNavigate();

        const handleClick = (path) => {
            navigate(path);
        }

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
                // 검색 처리 로직 추가 위치
            }
        };


    return (
        <div className='header_Bottom'>
            <div className='menu_Bottom'>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/about')}>About</span>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/brand')}>Brand</span>
                <img style={{ width: '40px', height: '40px', marginLeft: '100px', marginRight: '100px'}} src={CrownImage} alt="crown" />
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick("/store")}>Store</span>
                <div onClick={toggleSearchBar}>
                    <img style={{ width: '15px', height: '15px', marginRight: '-95px', marginLeft: '100px'}} src={SearchImage} alt="search" />
                    <span style={{ position: 'relative', top: '-2px'}}>Search</span>
                    {showSearchBar && (
                        <div className={`searchBarContainer ${showSearchBar ? 'active' : ''}`}
                            onClick={(e) => e.stopPropagation()}>
                            <input type="text" placeholder="검색..." 
                            value={searchText} onChange={handleInputChange} onKeyDown={handleKeyDown}/>
                        </div>
                    )}
                </div>
            </div>
            <div className='iconContainer'>
                <img className='cartIcon' src={cartIcon} alt='cartIcon' onClick={()=>handleClick('/MyPage')}/>
                <img className='MyIcon' src={MYIcon} alt='MYIcon' onClick={() => handleClick('/login')}/>
            </div>
        </div>
    );
}

export default Header_Bottom;