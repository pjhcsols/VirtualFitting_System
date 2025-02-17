import React, { useState, useRef, useEffect } from "react";
import '../ui/PopUp.css';
import { IMG_USER } from "../constants";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PopUpBottom = ({ logout }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState(IMG_USER);
    const popupRef = useRef(null);
    const navigate = useNavigate();
    const storedUserInfo = localStorage.getItem('user_info');
    const userInfo = JSON.parse(storedUserInfo);
    const loginType = userInfo.loginType;
    const userId = userInfo.userId;

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

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await fetch(`http://218.233.221.147:8080/User/getProfileImage?userId=${userId}`);
                if (response.ok) {
                    const blob = await response.blob();
                    if (blob.size > 0) {
                        const imageUrl = URL.createObjectURL(blob);
                        setProfileImageUrl(imageUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, [userId]);

    const handleLogout = () => {
        console.log("클릭");
        logout();
        setIsOpen(false);
        localStorage.removeItem('login-token');
        navigate('/');
    };

    return (
        <>
            {isOpen && (
                <div className="popup-container-bottom" ref={popupRef}>
                    <div className="user-bottom-container">
                        <img src={profileImageUrl} alt="user" onClick={() => handleClick('/MyPage')}/>
                        <span className="userId-bottom">
                            {userId}님<br />
                            {loginType}
                        </span>
                    </div>
                    <button className="logoutButton" onClick={handleLogout}>logout</button>
                </div>
            )}
        </>
    );
};

export default PopUpBottom;
