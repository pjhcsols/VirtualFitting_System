        import React, { useState, useEffect, useCallback } from "react";
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
        import DaumPostCode from "react-daum-postcode";
        import Modal from "react-modal";

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
                passwordCheck: "",
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

                if (name === 'password') {
                    const isPasswordValid = checkPasswordConditions(value);
                    setPasswordCondition(isPasswordValid ? '' : '영어 소문자, 대문자, 특수문자 1개 이상 포함, 8자 이상이어야 합니다.');
                }

                setInputValue((prevInputValue) => ({
                    ...prevInputValue,
                    [name]:value,
                }));

                if (name === 'passwordCheck') {
                    setPasswordMatch(value === inputValue.password);
                }
            };
            
            const checkPasswordConditions = (password) => {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
            
                return passwordRegex.test(password);
            };

            const toggleModal = () => {
                setIsOpen(!isOpen);
            };

            const completeHandler = (data) => {
                console.log("실행");
                setInputValue((prevInputValue) => ({
                    ...prevInputValue,
                    zipCode: data.zonecode,
                    roadAddress : data.roadAddress
                }));
                
                setIsOpen(false);
            };

            const customStyles = {
                overlay: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 100,
                },
                content: {
                    left: "0",
                    margin: "auto",
                    width: "500px",
                    height: "600px",
                    padding: "0",
                    overflow: "hidden",
                },
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                const address = inputValue.zipCode + "," + inputValue.roadAddress + "," + inputValue.detailAddress;
                const formattedDate = `${selectDate.getFullYear()}-${String(selectDate.getMonth() + 1).padStart(2, '0')}-${String(selectDate.getDate()).padStart(2, '0')}`;
                
                const data = {
                    userNumber: null,
                    id: inputValue.id,
                    password: inputValue.password,
                    emailAddress: inputValue.emailAddress,
                    phoneNumber: inputValue.phoneNumber,
                    userGrade: 'BRONZE',
                    loginType: 'NORMAL',
                    userImageUrl: null,
                    name: inputValue.name,
                    birthDate: formattedDate,
                    address: address
                };
        
                try {
                    console.log("서버응답*******************8");
                    const response = await ServerAPI.post('/normalUser/signup', data);
                    navigate("/login");
                }
                catch (error) {
                    console.error("서버와의 통신 중 오류 발생", error);
                }
            };  

            return (
                <div className="SignUpFormStyle">
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
                    <div>
                        <img src={pwdImg} alt="Password" className="inputIcon" style={{marginTop: '167px', marginLeft: '35px'}} />
                        <input 
                            name="password"
                            type="password" 
                            placeholder="비밀번호를 입력해주세요" 
                            value={inputValue.password} 
                            onChange={(e) => inputChangeHandler(e, 'password')} 
                        />
                    </div>
                    {passwordCondition && inputValue.password && (<div className="password-condition" style={{paddingLeft: '15px'}}>{passwordCondition}</div>)}

                    <label htmlFor="passwordCheck" style={{marginRight: '270px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>비밀번호 확인</label>
                    <div className="inputGroup" style={{display: "flex", position:"relative"}}>
                        <img src={pwdCheckImg} alt="PasswordCheck" className="inputIcon" style={{marginRight: '15px'}}/>
                        <input 
                            name="passwordCheck"
                            type="password"
                            placeholder="비밀번호를 확인해주세요"
                            value={inputValue.passwordCheck}
                            onChange={(e) => inputChangeHandler(e, 'passwordCheck')}
                        />
                    </div>
                    {!passwordMatch && inputValue.passwordCheck && (<div className="password-condition" style={{paddingRight: '180px'}}>비밀번호가 일치하지 않습니다.</div>)}

                    <label htmlFor="emailAddress" style={{marginRight: '310px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>이메일</label>
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

                    <label htmlFor="name" style={{marginRight: '322px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>이름</label>
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

                    <label htmlFor="birthDate" style={{marginRight: '298px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>생년월일</label>
                    <div className="inputGroup">
                        <img src={calendarImg} alt="calendar" className="inputIcon" style={{width: '17px', height: '17px'}} />
                        <DatePicker
                            locale={ko}
                            selected={selectDate}   
                            onChange={(date) => setSelectDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                            showYearDropdown
                            showMonthDropdown
                        />
                    </div>

                    <label htmlFor="phoneNumber" style={{marginRight: '298px', marginBottom: '2px', marginTop: '-32px', fontSize: '12px', fontWeight: 'bold' }}>전화번호</label>
                    <div className="inputGroup" style={{paddingBottom: 0}}>
                        <img src={phoneNumImg} alt="phoneNumber" className="inputIcon" style={{width: '17px', height: '17px'}}/>
                        <input 
                            name="phoneNumber"
                            tpye="number"
                            placeholder="전화번호를 입력해주세요"
                            value={inputValue.phoneNumber}
                            onChange={(e) => inputChangeHandler(e, 'phoneNumber')}
                            style={{marginBottom: '5px'}}
                        />
                    </div>

                    <label htmlFor="address" className="inputLabel">주소</label>
                    <div>
                        <input style={{width: '60px', marginRight: '5px', marginLeft: '35px', paddingLeft: '10px', marginBottom: '5px'}}
                            name="zipCode"
                            type="text"
                            readOnly
                            placeholder="우편번호"
                            value={inputValue.zipCode}
                            // onChange={(e) => inputChangeHandler(e, 'zipCode')}
                        />
                        <button className="AddressButton" onClick={toggleModal}>우편번호 찾기</button> 
                        <input
                            style={{paddingLeft: '10px', width: '330px', marginLeft: '35px', marginBottom: '5px'}}
                            name="roadAddress"
                            type="text"
                            readOnly
                            placeholder="도로명 주소"
                            value={inputValue.roadAddress}
                            // onChange={(e) => inputChangeHandler(e, 'roadAddress')}
                        />
                        <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
                            <DaumPostCode onComplete={completeHandler} height="100%" />
                        </Modal>
                        <input
                            style={{paddingLeft: '10px', marginLeft: '35px', width: '330px'}}
                            name="detailAddress"
                            type="text"
                            placeholder="상세 주소"
                            value={inputValue.detailAddress}
                            onChange={(e) => inputChangeHandler(e, 'detailAddress')}
                        />
                    </div>
                    <button className="StyledButton" type="submit" onClick={handleSubmit}>회원가입</button>
                </div>
            );
        };

        export default SignUpPageUser;


