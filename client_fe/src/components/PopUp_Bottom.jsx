import React, { useState, useRef, useEffect } from "react";
import './PopUp.css';
import userImg from '../assets/img/mypage_user.png';
import { useAuth } from "../context/AuthContext";

const PopUp = () => {
    const {logout} = useAuth();
    const [isOpen, setIsOpen] = useState(true);
    const popupRef = useRef(null);

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
    };

    return (
        <>
            {isOpen && (
                <div className="popup-container-bottom" ref={popupRef}>
                    <img style={{ width: '70px', height: '70px', marginRight: '120px', marginTop: '25px' }} src={userImg} alt="user" />
                    <button className="logoutButton" onClick={handleLogout}>logout</button>
                </div>
            )}
        </>
    );
};

export default PopUp;