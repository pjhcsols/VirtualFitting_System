import React, { useState, useEffect } from "react";
import UserImg from '../assets/img/user.png';
import CartImg from '../assets/img/Cart.png';
import CrownImg from '../assets/img/Crown.png';
import SearchImg from '../assets/img/Search.png';
import './Header_Store.css';
import { useNavigate } from "react-router-dom";
import PopUpStore from "./PopUp_Store.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";

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

    const handleUserImgClick = () => {
        if (localStorage.getItem('login-token')) {
            togglePopup();
        } else {
            navigate('/login');
        }
    };

    const [showDropdown, setShowDropdown] = useState({ top: false, outer: false, bottom: false, bagAcc: false });

    const handleMouseEnter = (cate) => {
        setShowDropdown({ ...showDropdown, [cate]: true });
    };
    
    const handleParentMouseLeave = (catey) => {
        setShowDropdown({ ...showDropdown, [catey]: false });
    };

    const handleSubCategoryClick = (cate) => {
        handleParentMouseLeave(cate);
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
        <div className="header_store">
            <div className="right-icons">
                <img style={{width: '20px', height: '20px', marginRight: '10px'}} src={CartImg} alt="cart" onClick={() => handleCartClick('/mypage?section=shoppingCart')}/>
                <img style={{width: '20px', height: '20px'}} src={UserImg} alt="user" onClick={handleUserImgClick} />
            </div>
            {popupOpen && <PopUpStore logout={togglePopup} />}
            <div className="menu_store">
                <img style={{width: '30px', height: '30px', marginLeft: '40px', marginRight: '-10px', marginTop: '-3px'}} src={CrownImg} alt="crown" onClick={() => handleClick('/', 'Home')} />
                <span className="menu-title" onClick={() => handleClick('/', 'Home')}>Basilium</span>
                <span onClick={() => handleClick('/store', 'New Arrival')}>New Arrival</span>
                <span onClick={() => handleClick('/store', 'Best 50')}>Best 50</span>
                <span onMouseEnter={() => handleMouseEnter('top')} onMouseLeave={() => handleParentMouseLeave('top')}>
                    Top
                    {showDropdown.top && (
                        <div className="dropdown-container">
                            <div className="dropdown-content" onMouseEnter={() => handleMouseEnter('top')} onMouseLeave={() => handleParentMouseLeave('top')}>
                                <div onClick={() => {handleClick('/store', 'T-shirts'); handleSubCategoryClick('top');}}>T-shirts</div>
                                <div onClick={() => {handleClick('/store', 'long sleeves'); handleSubCategoryClick('top');}}>long sleeves</div>
                                <div onClick={() => {handleClick('/store', 'blouse'); handleSubCategoryClick('top');}}>blouse</div>
                                <div onClick={() => {handleClick('/store', 'knitwear'); handleSubCategoryClick('top');}}>knitwear</div>
                                <div onClick={() => {handleClick('/store', 'hood'); handleSubCategoryClick('top');}}>hood</div>
                                <div onClick={() => {handleClick('/store', 'vest'); handleSubCategoryClick('top');}}>vest</div>
                            </div>
                        </div>
                    )}
                </span>
                <span onMouseEnter={() => handleMouseEnter('outer')} onMouseLeave={() => handleParentMouseLeave('outer')}>
                    Outer
                    {showDropdown.outer && (
                        <div className="dropdown-container">
                            <div className="dropdown-content" onMouseEnter={() => handleMouseEnter('outer')} onMouseLeave={() => handleParentMouseLeave('outer')}>
                                <div onClick={() => {handleClick('/store', 'jacket'); handleSubCategoryClick('outer');}}>jacket</div>
                                <div onClick={() => {handleClick('/store', 'cardigan'); handleSubCategoryClick('outer');}}>cardigan</div>
                                <div onClick={() => {handleClick('/store', 'padding'); handleSubCategoryClick('outer');}}>padding</div>
                            </div>
                        </div>
                    )}
                </span>
                <span onMouseEnter={() => handleMouseEnter('bottom')} onMouseLeave={() => handleParentMouseLeave('bottom')}>
                    Bottom
                    {showDropdown.bottom && (
                        <div className="dropdown-container">
                            <div className="dropdown-content" onMouseEnter={() => handleMouseEnter('bottom')} onMouseLeave={() => handleParentMouseLeave('bottom')}>
                                <div onClick={() => {handleClick('/store', 'pants'); handleSubCategoryClick('bottom');}}>pants</div>
                                <div onClick={() => {handleClick('/store', 'shorts'); handleSubCategoryClick('bottom');}}>shorts</div>
                                <div onClick={() => {handleClick('/store', 'skirt'); handleSubCategoryClick('bottom');}}>skirt</div>
                            </div>
                        </div>
                    )}
                </span>
                <span onMouseEnter={() => handleMouseEnter('bagAcc')} onMouseLeave={() => handleParentMouseLeave('bagAcc')}>
                    Bag & Acc
                    {showDropdown.bagAcc && (  
                        <div className="dropdown-container">
                            <div className="dropdown-content" onMouseEnter={() => handleMouseEnter('bagAcc')} onMouseLeave={() => handleParentMouseLeave('bagAcc')}>
                                <div onClick={() => {handleClick('/store', 'accessory'); handleSubCategoryClick('bagAcc');}}>accessory</div>
                            </div>
                        </div> 
                    )}
                </span>
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
