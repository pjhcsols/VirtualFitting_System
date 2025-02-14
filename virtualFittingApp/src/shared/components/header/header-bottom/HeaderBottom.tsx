import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/AuthContext';
import Swal from "sweetalert2";
import { SEARCH_ICON, CROWN_ICON, CART_ICON, MY_ICON } from './constants';
import { User } from '../../../types/user';
import { isUserLoggedIn } from './utils/loggedIn.util';
import { fetchUserInfo } from './api/fetchUser.action';
import './HeaderBottom.css';
import { PopUpBottom } from '../../pop-up/pop-up-bottom/PopUpBottom'

const HeaderBottom = () => {
    const navigate = useNavigate();
    const [popupOpen, setPopupOpen] = useState(false);
    const { user, logout } = useAuth();
    const isLoggedIn = isUserLoggedIn();

    useEffect(() => {
        if (!isLoggedIn) {
            setPopupOpen(false);
        }
    }, [isLoggedIn]);

    const handleClick = (path: string) => {
        console.log('클릭됨');
        navigate(path);
    };

    const handleCartClick = (path: string) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
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
    };

    const togglePopup = () => {
        setPopupOpen(!popupOpen);
    };

    const handleUserImgClick = () => {
        if (isLoggedIn) {
            togglePopup();
        } else {
            navigate('/login');
        }
    };

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchText, setSearchText] = useState('');

    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            navigate('/searchResult', { state: { searchText } });
            setShowSearchBar(false);
            setSearchText('');
        }
    };

    return (
        <div className='HeaderBottom'>
            <div className='menu_Bottom'>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/about')}>About</span>
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick('/brand')}>Brand</span>
                <img style={{ width: '40px', height: '40px', marginLeft: '100px', marginRight: '100px', cursor: 'pointer' }} src={CROWN_ICON} alt="crown" onClick={() => handleClick('/')} />
                <span style={{ position: 'relative', top: '-8px' }} onClick={() => handleClick("/store")}>Store</span>
                <div onClick={toggleSearchBar}>
                    <img style={{ width: '15px', height: '15px', marginRight: '-95px', marginLeft: '100px', cursor: 'pointer' }} src={SEARCH_ICON} alt="search" />
                    <span style={{ position: 'relative', top: '-2px' }}>Search</span>
                    {showSearchBar && (
                        <div className={`searchBarContainer ${showSearchBar ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <input type="text" placeholder="검색..."
                                value={searchText} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                        </div>
                    )}
                </div>
            </div>
            <div className='iconContainer'>
                {isLoggedIn && user && (
                    <div className="user-info">
                        <p>{user.name}</p> {/* Display user name */}
                    </div>
                )}
                <img className='cartIcon' src={CART_ICON} alt='cartIcon' style={{ cursor: 'pointer' }} onClick={() => handleCartClick('/mypage?section=shoppingCart')} />
                <img className='MyIcon' src={MY_ICON} alt='MYIcon' onClick={handleUserImgClick} style={{ cursor: 'pointer' }} />
                {popupOpen && <PopUpBottom logout={logout} />}
            </div>
        </div>
    );
};

export default HeaderBottom;
