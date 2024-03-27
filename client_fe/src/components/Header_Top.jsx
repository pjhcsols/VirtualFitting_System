import React from 'react';
import './Header_Top.css'
import insta from '../assets/img/Insta_Icon.png';

function Header_Top() {
    return(
        <div className="header">
            <div className="logo">
                <img src={insta} alt="Instagram" />
            </div>
            <div className="menu">
                <span>Login</span>
                <span>MyPage</span>
                <span>Cart</span>
                <span>Notice</span>
                <span>Q&A</span>
            </div>
        </div>
    )
}

export default Header_Top;