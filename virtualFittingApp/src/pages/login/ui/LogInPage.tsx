import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { IMG_LOGO, IMG_BACKGROUND } from "../constants";
import "./LogInPage.css";
import { useNavigate } from "react-router-dom";

const LogInPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleTabClick = (login: boolean) => {
        if (isLogin !== login) setIsLogin(login);
    };

    const handleClick = (path: string) => navigate(path);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "110vh",
            position: "relative",
            background: `linear-gradient(to right, rgba(0, 0, 0, 0) 50%, black 50%), url(${IMG_BACKGROUND})`,
            backgroundSize: "100% 100%, contain",
            backgroundPositionX: "left",
            backgroundRepeat: "no-repeat",
        }}>
            <img src={IMG_LOGO} alt="Logo" 
                style={{
                    position: "absolute",
                    top: "40px",
                    right: "40.5%",
                    transform: "translateX(100%)",
                    cursor: "pointer",
                }} 
                onClick={() => handleClick("/")}
            />
            <div className="form_container">
                <div className="header">
                    <div className={`loginHeader ${isLogin ? "active" : ""}`} onClick={() => handleTabClick(true)}>
                        로그인
                    </div>
                    <div className={`signUpHeader ${isLogin ? "" : "active"}`} onClick={() => handleTabClick(false)}>
                        회원가입
                    </div>
                </div>
                <div className="body">
                    {isLogin ? <LoginForm /> : <SignUpForm />}
                </div>
            </div>
        </div>
    );
};

export default LogInPage;
