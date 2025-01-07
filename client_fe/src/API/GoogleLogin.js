import React from "react";
import GoogleLogo from "../assets/img/goggle.png";

const GoogleLogin = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const googleRedirectUrl = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=openid email profile`

    const loginHandler = () => {
        window.location.href = googleAuthUrl;
    };

    return (
        <>
            <img src={GoogleLogo} alt="google" style={{width: '45px', height: '45px'}} onClick={loginHandler} />
        </>
    )
}

export default GoogleLogin;