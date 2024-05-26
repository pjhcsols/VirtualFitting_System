import { useEffect} from "react";
import './NaverLogin.css';   
import { useLocation } from "react-router-dom";
import axios from "axios";

const NaverLogin = () => {
    const {naver} = window

    const initNaverLogin = () => {
        const naverLogin = new naver.LoginWithNaverId ({
            clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
            callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
            isPopup: true,
            loginButton: {color: 'green', type: 1, height: 38, width: 38}
        });
        naverLogin.init(); 
    }

    useEffect(() => {
        initNaverLogin();
        console.log("init!");
    }, []); 

    return (
        <>
            <div id="naverIdLogin"></div>
        </>
    )
}

export default NaverLogin;