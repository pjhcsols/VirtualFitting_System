import React from "react";
import NaverLogo from "../assets/img/naverIcon.png";

const NaverLogin = () => {
    const clientID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const stateString = process.env.REACT_APP_NAVER_STATE_STRING;
    const callbackUrl = process.env.REACT_APP_NAVER_CALLBACK_URL;
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${clientID}&response_type=code&redirect_uri=${callbackUrl}&state=${stateString}`;

    const loginHandler = () => {
        window.location.href = naverAuthUrl;
    };

    return (
        <>
            <img src={NaverLogo} alt="naver" style={{width: '39px', height: '39px'}} onClick={loginHandler}/>
        </>
    )
}

export default NaverLogin;  