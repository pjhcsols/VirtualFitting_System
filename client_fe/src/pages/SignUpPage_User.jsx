    import React, { useState, useEffect, useCallback } from "react";
    import backgroundImage from '../assets/img/loginBackground.png';
    import ServerAPI from "../API/ServerAPI.js";
    import { useAuth } from '../context/AuthContext.jsx';
    import SignUplogoImg from '../assets/img/SignUpLogo.png';
    import './SignUpPage.css';
    import styled from "styled-components";
    import { useNavigate } from "react-router-dom";
    import emailImg from '../assets/img/email.png';
    import pwdImg from '../assets/img/password.png';
    import pwdCheckImg from '../assets/img/pwd_check.png';
    import userIdImg from '../assets/img/userId.png';
    import phoneNumImg from '../assets/img/telephone.png';
    import DatePicker from 'react-datepicker';
    import 'react-datepicker/dist/react-datepicker.css';
    import calendarImg from '../assets/img/calendar.png';
    import ko from "date-fns/locale/ko";
   

    const SignUpPageUser = () => {
        const navigate = useNavigate();
        const [isLogin, setIsLogin] = useState(false);

        const handleTabClick = (login) => {
            setIsLogin(login);
            if (login) {
                navigate('/login');
            }
        };

        const handleClick = (path) => { 
            navigate(path);
        }
        

        return (    
            <>
                <div className="parent-container">
                    <img src={SignUplogoImg} className="signUpLogo" alt='Logo' onClick={() => handleClick('/')} />
                    <div className='form_signup_container'>
                        <div className='header'>
                            <div className={`loginHeader ${isLogin ? 'active' : ''}`} onClick={() => handleTabClick(true)}>로그인</div>
                            <div className={`signUpHeader ${isLogin ? '' : 'active'}`} onClick={() => handleTabClick(false)}>회원가입</div>
                        </div>
                        <div className="body">
                            {!isLogin ? (
                                <SignUp />
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                </div>
                <div className="child-container">
                </div>
            </>
        );
    };

    const SignUp = () => {
        const navigate = useNavigate();
        const {user, logout, loading} = useAuth();
        const {login} = useAuth();
        const [isOpen, setIsOpen] = useState(false);
        const [passwordCondition, setPasswordCondition] = useState('');
        const [passwordMatch, setPasswordMatch] = useState(true);
        const [selectDate, setSelectDate] = useState(new Date());
        const [inputValue, setInputValue] = useState({
            userNumber: "",
            id: "",
            password: "",
            emailAddress: "",
            phoneNumber: "",
            userGrade: "",
            loginType: "",
            userImageUrl: "",
            name: "",
            birthDate: "",
            zipCode: "",
            roadAddress: "",
            detailAddress: ""
        });

        const inputChangeHandler = (e, name) => {
            const {value} = e.target;

            // 비밀번호 조건 체크
            if (name === 'password') {
                const isPasswordValid = checkPasswordConditions(value);
                setPasswordCondition(isPasswordValid ? '' : '비밀번호는 영어 소문자, 대문자, 특수문자 1개 이상 포함, 8자 이상이어야 합니다.');
            }
        
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                [name]: value,
            }));
        
            // 비밀번호 확인 체크
            if (name === 'passwordCheck') {
                setPasswordMatch(value === inputValue.password);
            }
        };

        const checkPasswordConditions = (password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
        
            return passwordRegex.test(password);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            
            const data = {
                userNumber: null,
                id: inputValue.id,
                password: inputValue.password,
                emailAddress: inputValue.emailAddress,
                phoneNumber: inputValue.phoneNumber,
                userGrade: null,
                loginType: null,
                userImageUrl: null,
                name: inputValue.name,
                birthDate: inputValue.birthDate,
                zipCode: inputValue.zipCode,
                roadAddress: inputValue.roadAddress,
                detailAddress: inputValue.detailAddress
            };
            
            try {
                console.log("서버응답*******************8");
                const response = await ServerAPI.post('/normalUser/signup', data);
                console.log(data);

            }
            catch (error) {
                console.error("서버와의 통신 중 오류 발생", error);
                console.log(data);
            }
        };

        return (
            <div className="SignUpFormStyle" onSubmit={handleSubmit}>
                <label htmlFor="id" style={{marginTop: '20px', marginBottom: '2px', marginLeft: '-310px', fontSize: '12px', fontWeight: 'bold'}}>아이디</label>
                <div className="inputGroup">
                    <img src={userIdImg} alt="userId" className="inputIcon" style={{width: '16px', height: '16px'}}/>
                    <input 
                        name="id"
                        type="text"
                        placeholder="아이디를 입력해주세요" 
                        value={inputValue.id} 
                        onChange={(e) => inputChangeHandler(e, 'id')} 
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '340px', marginLeft: '10px', marginTop: '-35px' }}>
                    <label htmlFor="password" style={{marginLeft: '-8px',marginBottom: '2px', fontSize: '12px', fontWeight: 'bold' }}>비밀번호</label>
                    <span style={{ color: 'blue', fontSize: '12px', cursor: 'pointer'}}>비밀번호 재설정</span>
                </div>
                <div className="inputGroup">
                    <img src={pwdImg} alt="Password" className="inputIcon" />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="비밀번호를 입력해주세요" 
                        value={inputValue.password} 
                        onChange={(e) => inputChangeHandler(e, 'password')} 
                    />
                </div>
                <label htmlFor="password" style={{marginRight: '270px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>비밀번호 확인</label>
                <div className="inputGroup">
                    <img src={pwdCheckImg} alt="PasswordCheck" className="inputIcon" />
                    <input 
                        name="passwordCheck"
                        tpye="password"
                        placeholder="비밀번호를 확인해주세요"
                        value={inputValue.passwordCheck}
                        onChange={(e) => inputChangeHandler(e, 'passwordCheck')}
                    />
                </div>
                <label htmlFor="password" style={{marginRight: '310px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>이메일</label>
                <div className="inputGroup">
                    <img src={emailImg} alt="email" className="inputIcon" />
                    <input 
                        name="emailAddress"
                        tpye="email"
                        placeholder="이메일을 입력해주세요"
                        value={inputValue.emailAddress}
                        onChange={(e) => inputChangeHandler(e, 'emailAddress')}
                    />
                </div>
                <label htmlFor="password" style={{marginRight: '322px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>이름</label>
                <div className="inputGroup">
                    <img src={userIdImg} alt="username" className="inputIcon" style={{width: '17px', height: '17px'}}/>
                    <input 
                        name="name"
                        tpye="text"
                        placeholder="이름을 입력해주세요"
                        value={inputValue.name} 
                        onChange={(e) => inputChangeHandler(e, 'name')}
                    />
                </div>
                <label htmlFor="password" style={{marginRight: '298px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>전화번호</label>
                <div className="inputGroup">
                    <img src={phoneNumImg} alt="phoneNumber" className="inputIcon" style={{width: '17px', height: '17px'}}/>
                    <input 
                        name="phoneNumber"
                        tpye="number"
                        placeholder="전화번호를 입력해주세요"
                        value={inputValue.phoneNumber}
                        onChange={(e) => inputChangeHandler(e, 'phoneNumber')}
                    />
                </div>
                <label htmlFor="password" style={{marginRight: '298px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>생년월일</label>
                <div className="inputGroup">
                    <img src={calendarImg} alt="calendar" className="inputIcon" style={{width: '17px', height: '17px'}} />
                    <DatePicker
                        locale={ko}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="YYYY-MM-DD"
                        selected={selectDate}   
                        onChange={(date) => setSelectDate(date)}
                        showYearDropdown
                        showMonthDropdown
                    />
                </div>
                <button className="StyledButton" type="submit">회원가입</button>
            </div>
        );
    };

    export default SignUpPageUser;


