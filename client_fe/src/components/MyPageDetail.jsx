import React, { useState, useEffect } from "react";
import './MyPageDetail.css'
import userImg from '../assets/img/userImg.svg';
import axios from "axios";

const MypageDetail = () => {
    const [userData, setUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState({});

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}` // Authorization 헤더에 JWT 포함
            }
        };

        axios.get("http://localhost:8080/normalUser/user/detail", config)
            .then(response =>{
                setUserData(response.data);
                // 수정된 데이터 초기화
                setUpdatedUserData(response.data);
            })
            .catch(error =>{
                console.log('Error fetching user data:', error);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData(prevData => ({
            ...prevData,
            user: {
                ...prevData.user,
                [name]: value
            }
        }));
    };

    const handleSubmit = () => {
        // 수정된 userData를 서버에 전송하는 로직 추가
        console.log("수정된 userData:", updatedUserData);
        const jwtToken = localStorage.getItem("login-token");
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        };
        console.log(updatedUserData);
        const data = {
            'name' : updatedUserData.user.name,
            'emailAddress' : updatedUserData.user.emailAddress,
            "password" : updatedUserData.user.password,
            "phoneNumber" : updatedUserData.user.phoneNumber
        }
        console.log(data);
        axios.patch("http://localhost:8080/normalUser/modify", JSON.stringify(data), config)
            .then(response => {
                console.log("수정 성공:", response.data);
                alert("수정되었습니다."); // 수정 성공 알림창
            })
            .catch(error => {
                console.error("수정 실패:", error);
            });
    };

    return (
        <div className="mypage_detail_container">
            <div className="mypagedetail">
                {userData ? (
                    <img className="mypage_detail_profile" src={userImg} alt="User Image" />
                ) : (
                    <div className="mypage_detail_profile">
                        <img src={userImg} alt="User Image" />
                    </div>
                )}
                <div className="mypage_detail_button_div">
                    <button onClick={handleSubmit}>사진 변경</button>
                </div>
            </div>
            <div className="mypage_detail_info">
                <table className="mypage_detail_info_table">
                    <tbody>
                        <tr>
                            <td>개인정보</td>
                            <td><input type="button" value="수정" onClick={handleSubmit}></input></td>
                        </tr>
                        <tr>
                            <td>이름:</td>
                            <td><input name="name" className="mypage_input_field" type="text" defaultValue={userData ? userData.user.name : ''} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td>이메일:</td>
                            <td><input name="emailAddress" className="mypage_input_field" type="email" defaultValue={userData ? userData.user.emailAddress : ''} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td>비밀번호:</td>
                            <td><input name="password" className="mypage_input_field" type="password" defaultValue={userData ? userData.user.password : ''} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td>전화번호:</td>
                            <td><input name="phoneNumber" className="mypage_input_field" type="tel" defaultValue={userData ? userData.user.phoneNumber : ''} onChange={handleInputChange} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MypageDetail;
