import React from "react";
import kakaoLogo from '../assets/img/kakao.png';

const KaKaoLogin = () => {
    const restApiKey = process.env.REACT_APP_REST_API_KEY;
    const redirectUrl = process.env.REACT_APP_KAKAO_REDIRECT_URL;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUrl}&response_type=code`;

    const loginHandler = () => {
        window.location.href = kakaoAuthUrl;
    };

    return (
        <>
            <img src={kakaoLogo} alt="kakao" style={{width: '45px', height: '45px'}} onClick={loginHandler} />
        </>
    )
}

export default KaKaoLogin;