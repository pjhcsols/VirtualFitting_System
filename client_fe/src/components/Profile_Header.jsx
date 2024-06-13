import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile_Header.css'
import userImg from '../assets/img/userImg.svg';

const Profile_Header = (props) => {

    const [profileImageUrl, setProfileImageUrl] = useState(userImg);
    const navigate = useNavigate();
    const storedUserInfo = localStorage.getItem('user_info');
    const userInfo = JSON.parse(storedUserInfo);
    const loginType = userInfo.loginType;
    const userId = userInfo.userId;

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

    const handleEditProfile = () => {
        // 프로필 편집 페이지로 이동
        navigate('/ProfilePage');   
    };

    const handleRegisterProduct = () => {
        navigate('/productRegisteration');
    };

    return (
        <div className="profile_container">
            <img className="profile" src={profileImageUrl} alt="User Image" />
            <div className="profile_info">
                {/* <h2>{props.userData.id ? props.userData.id : "unknown user"}</h2> */}
                <h2>{userId}</h2>
                <h3>{props.userData.emailAddress ? props.userData.emailAddress : "unknownuser@gmail.com"}</h3>
            </div>
            
            <div className="profile_edit">
                <button onClick={handleEditProfile}>프로필 편집</button>
                {loginType === 'BRAND' && (
                    <button onClick={handleRegisterProduct}>상품 등록</button>
                )}
            </div>
        </div>
    );
}

export default Profile_Header;