import NaverLogo from "../assets/img/naverIcon.png";

const NaverLogin = () => {
    const clientID = import.meta.env.REACT_APP_NAVER_CLIENT_ID;
    // const stateString = import.meta.env.REACT_APP_NAVER_STATE_STRING;
    const state = "true";
    const callbackUrl = import.meta.env.REACT_APP_NAVER_CALLBACK_URL;
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientID}&state=${state}&redirect_uri=${callbackUrl}`;

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