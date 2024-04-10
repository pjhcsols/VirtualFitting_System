import React from "react";
import './Profile_Header.css'
import userImg from '../assets/img/userImg.svg';

const Profile_Header = () => {

    return (
        <div className="profile_container">
            <div className="profile">
                <img src={userImg}/>
            </div>
            <div className="profile_info">
                <h2>User's name</h2>
                <h3>sample@gmail.com</h3>
            </div>
            
            <div className="profile_edit">
                <button>프로필 편집</button>
            </div>
        </div>
    );

}

export default Profile_Header;