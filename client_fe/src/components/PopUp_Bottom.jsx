import React, { useState, useRef, useEffect } from "react";
import './PopUp.css';
import userImg from '../assets/img/mypage_user.png';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PopUpBottom = () => {
    const {logout} = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const popupRef = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const storedToken = localStorage.getItem('login-token');

    const handleClick = (path) => {
        console.log('클릭됨');
        navigate(path);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLogout = () => {
        console.log("클릭");
        logout();
        setIsOpen(false);
        navigate('/')
    };

    return (
        <>
            {isOpen && (
                <div className="popup-container-bottom" ref={popupRef}>
                    <div className="user-bottom-container">
                        <img style={{ width: '70px', height: '70px', cursor:'pointer', marginTop:'25px'}} src={userImg} alt="user" onClick={() => handleClick('/MyPage')}/>
                        <span className="userId-bottom">{userId}</span>
                    </div>
                    <button className="logoutButton" onClick={handleLogout}>logout</button>
                </div>
            )}
        </>
    );
};

export default PopUpBottom;