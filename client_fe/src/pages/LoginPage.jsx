import React, { useState, useEffect, useCallback } from "react";
import backgroundImage from '../assets/img/loginBackground.png';
import ServerAPI from "../API/ServerAPI";
import { useAuth } from '../context/AuthContext.jsx';
import logoImg from '../assets/img/logo.png';
import './LoginPage.css';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import userIdImg from '../assets/img/userId.png';
import pwdImg from '../assets/img/password.png';
import NaverLogin from "../API/NaverLogin.js";  
import KaKaoLogin from "../API/KakaoLogin.js";
import GoogleLogin from "../API/GoogleLogin.js";
import Swal from "sweetalert2";
import normalImg from "../assets/img/normal.png";
import firmImg from "../assets/img/firm.png";

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const handleTabClick = (login) => {
        setIsLogin(login);
    };

    const handleClick = (path) => {
        console.log('클릭됨');
        navigate(path);
    }
    

    return (
        <div style={{
            display: 'flex',    
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: `110vh`,
            position: 'relative',
            background: `linear-gradient(to right, rgba(0, 0, 0, 0) 50%, black 50%), url(${backgroundImage})`,
            backgroundSize: `100% 100%, contain`,
            backgroundPositionX: 'left',
            backgroundRepeat: `no-repeat`
        }}>
            <img src={logoImg} alt='Logo' style={{
                position: 'absolute',   
                top: '40px',
                right: '40.5%', 
                transform: 'translateX(100%)',
                cursor: "pointer"
            }} onClick={()=>handleClick('/')}/>
            <div className='form_container'>
                <div className='header'>
                    <div className={`loginHeader ${isLogin ? 'active' : ''}`} onClick={() => handleTabClick(true)}>로그인</div>
                    <div className={`signUpHeader ${isLogin ? '' : 'active'}`} onClick={() => handleTabClick(false)}>회원가입</div>
                </div>
                <div className="body">
                    {isLogin ? (
                        <LoginForm />
                    ) : (
                        <SignUpForm />  
                    )}
                </div>
            </div>
        </div>
    );  
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const {user, logout, loading} = useAuth();
    const {login} = useAuth();

    const handleIdChange = (e) => {
        setId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            userId: id,
            userPassword: password,
        };
    
        try {
            const response = await ServerAPI.post('/User/login', data);

            if (response.status === 200) {
                localStorage.clear();
                localStorage.setItem('login-token', response.data.token);
                const userInfo = {
                    userId: data.userId,
                    loginType: response.data.type
                };
                localStorage.setItem('user_info', JSON.stringify(userInfo));
              
                navigate('/');
            }
        }
        catch (error) {
            Swal.fire({
                title: '아이디 혹은 비밀번호가 일치하지않습니다!',
                icon: 'warning',
                confirmButtonColor: '#000',
                confirmButtonText: '확인',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                    console.log("오류 발생", error);
                }
            });
        }
    };

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: 'center'} }>
            <label htmlFor="id" style={{marginTop: '20px', marginBottom: '2px', marginLeft: '-310px', fontSize: '12px', fontWeight: 'bold'}}>아이디</label>
            <div className="inputGroup">
                <img src={userIdImg} alt="id" className="inputIcon" style={{width: '17px', height: '17px'}}/>
                <input 
                    id="id"
                    type="text" 
                    placeholder="아이디를 입력해주세요" 
                    value={id} 
                    onChange={handleIdChange} 
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '340px', marginLeft: '10px', marginTop: '-28px' }}>
                <label htmlFor="password" style={{marginLeft: '-8px',marginBottom: '2px', fontSize: '12px', fontWeight: 'bold' }}>비밀번호</label>
                <span style={{ color: 'blue', fontSize: '12px', cursor: 'pointer'}}>비밀번호 재설정</span>
            </div>
            <div className="inputGroup">
                <img src={pwdImg} alt="Password" className="inputIcon" />
                <input 
                    id="password"
                    type="password" 
                    placeholder="비밀번호를 입력해주세요" 
                    value={password} 
                    onChange={handlePasswordChange} 
                />
            </div>
            <button className="loginButton" onClick={handleSubmit}>로그인</button>
            <p style={{ marginTop: '36px', marginBottom: '7px', fontSize:'13px', fontWeight:'bold'}}>다른 계정으로 로그인하기</p>
            <div className="logoContainer">
                <div>
                    <KaKaoLogin />
                    <div className="kakaoLogoName">Kakao</div>
                </div>
                <div>   
                    <NaverLogin />  
                    <div className="naverLogoName">Naver</div>
                </div>
                <div>
                    <GoogleLogin />
                    <div className="googleLogoName">Goggle</div>
                </div>
            </div>
        </div>
    );
};

const SignUpForm = () => {
    const navigate = useNavigate();

    const handleClick = (path) => {
        console.log('클릭됨');
        navigate(path);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div className="vertical-group">
                <img src={normalImg} alt="normal" className="normal-img"/>
                <button className="signupButton" onClick={()=>handleClick('/Signup_User')}>일반회원</button>
            </div>
            <div className="vertical-group">
                <img src={firmImg} alt="firm" className="normal-img"/>
                <button className="signupButton" onClick={()=>handleClick('/Signup_Brand')}>사업자</button>
            </div>
        </div>
    );
};

export default LoginPage;