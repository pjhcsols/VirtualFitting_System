    import React, { useState, useEffect, useCallback } from "react";
    import backgroundImage from '../assets/img/loginBackground.png';
    import ServerAPI from "../API/ServerAPI";
    import { useAuth } from '../context/AuthContext.jsx';
    import logoImg from '../assets/img/logo.png';
    import './LoginPage.css';
    import styled from "styled-components";
    import { useNavigate } from "react-router-dom";
    import emailImg from '../assets/img/email.png';
    import pwdImg from '../assets/img/password.png';

    const LoginFormStyle = styled.form`
        display: flex;
        flex-direction: column;
        align-items: center;

        .inputGroup {
            display: flex;
            position: relative;
        }
        
        .inputIcon {
            position: absolute;
            left: 10px;
            top: 18px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
        }
        
        input {
            margin-bottom: 40px;
            padding: 8px;
            width: 300px;
            height: 20px;
            border-radius: 5px;
            background-color: #dee2e6;
            border: none;
            padding-left: 40px;
        }

        input::placeholder {
            font-size: 10px;
        }

        button {
            background-color: #000; 
            color: #fff; 
            width: 350px;
            height: 40px;
            padding: 10px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            margin-top: -13px;
            font-size: 20px;
            padding-top: 6px;   
        }
    `;

    const SingUpFormStyle = styled.form`
        display: flex;
        flex-direction: column;
        align-items: center;
        

        button {
            background-color: #5F5F5F; 
            color: #fff; 
            width: 350px;
            height: 60px;
            padding: 10px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
            margin-top: 70px;
            font-size: 20px;
            padding-top: 6px;   
        }
    
    
    `

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
                height: `100vh`,
                position: 'relative',
                background: `linear-gradient(to right, rgba(0, 0, 0, 0) 50%, black 50%), url(${backgroundImage})`,
                backgroundSize: `100% 100%, contain`,
                backgroundPositionX: 'left',
                backgroundRepeat: `no-repeat`
            }}>
                <img src={logoImg} alt='Logo' style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40%', 
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

        // const checkLoginStatus = useCallback(async () => {
        //     const token = localStorage.getItem('login-token');
        
        //     if (token) {
        //         try {
        //             const response = await ServerAPI.post('/User/login', {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`
        //                 }
        //             });
        
        //             login({ username: response.data.userData });
        //         } catch (error) {
        //             console.error('오류발생');
        //         }
        //     }
        // }, [login]);

        // useEffect( () => {
        //     checkLoginStatus();
        //   }, [checkLoginStatus]);

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
                    console.log(response.data);
                    localStorage.clear()
                    localStorage.setItem('login-token', response.data)
                    localStorage.setItem('user_id', data.userId)
                    //checkLoginStatus();
                    
                    navigate('/');
                  }
            }
            catch (error) {
                navigate('/login');
            }
        };

        return (
            <LoginFormStyle onSubmit={handleSubmit}>
                <label htmlFor="id" style={{marginTop: '20px', marginBottom: '2px', marginLeft: '-310px', fontSize: '12px', fontWeight: 'bold'}}>아이디</label>
                <div className="inputGroup">
                    <img src={emailImg} alt="Email" className="inputIcon" />
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
                <button type="submit">로그인</button>
                <p style={{ marginTop: '40px', fontSize:'13px', fontWeight:'bold'}}>다른 계정으로 로그인하기</p>
            </LoginFormStyle>
        );
    };

    const SignUpForm = () => {
        return (
            <SingUpFormStyle>
                <button>일반회원 가입하기</button>
                <button>사업자 회원 가입하기</button>
            </SingUpFormStyle>  
        );
    };

    export default LoginPage;