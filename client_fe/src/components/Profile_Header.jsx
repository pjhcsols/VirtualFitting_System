import React from "react";
import './Profile_Header.css'
import userImg from '../assets/img/userImg.svg';

const Profile_Header = (props) => {


    return (
        
        <div className="profile_container">
            {props.userData.userImageUrl ? (
                <img className="profile" src={props.userData.userImageUrl} alt="User Image" />
            ) : (
                <div className="profile">
                    <img src={userImg} alt="User Image" />
                </div>
            )}
            <div className="profile_info">
                <h2>{props.userData.id ?  props.userData.id : "unknown user"}</h2>
                <h3>{props.userData.emailAddress ? props.userData.emailAddress : "unknownuser@gmail.com"}</h3>
            </div>
            
            <div className="profile_edit">
                <button>프로필 편집</button>
            </div>
        </div>
    );

}

export default Profile_Header;