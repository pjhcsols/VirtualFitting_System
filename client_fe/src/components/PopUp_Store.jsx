    import React, { useState, useRef, useEffect } from "react";
    import './PopUp.css';
    import userImg from '../assets/img/mypage_user.png';
    import { useAuth } from "../context/AuthContext";
    import { useNavigate } from "react-router-dom";

    const PopUpStore = () => {
        const {logout, isLoggedOut} = useAuth();
        const [isOpen, setIsOpen] = useState(true);
        const popupRef = useRef(null);
        const navigate = useNavigate();
        const userId = localStorage.getItem('user_id');         

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
            logout();
            setIsOpen(false);
            navigate('/')
        };

        const handleClick = (path) => {
            console.log('클릭됨');
            navigate(path);
        };

        return (
            <>
                {isOpen && (
                    <div className="popup-container-store" ref={popupRef}>
                        <div className="user-store-container">
                            <img style={{ width: '70px', height: '70px', marginRight: '40px', marginTop: '25px', cursor:'pointer'}} src={userImg} alt="user" onClick={() => handleClick('/MyPage')}/>
                            <span className="userId-store">{userId}</span>
                        </div>
                        <button className="logoutButton" onClick={handleLogout}>logout</button>
                    </div>
                )}
            </>
        );
    };

    export default PopUpStore;