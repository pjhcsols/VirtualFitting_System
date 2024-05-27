import React from "react";
import GoogleLogo from "../assets/img/goggle.png";

const GoogleLogin = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_KEY;
    const googleRedirectUrl = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&scope=openid%20profile%20email&redirect_uri=${googleRedirectUrl}`

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