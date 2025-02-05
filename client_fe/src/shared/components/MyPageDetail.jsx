import React, { useState, useEffect } from "react";
import './MyPageDetail.css'
import initialUserImg from '../assets/img/userImg.svg';
import axios from "axios";

const MypageDetail = () => {
    const [userData, setUserData] = useState(null);
    const [updatedUserData, setUpdatedUserData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [userImg, setUserImg] = useState(initialUserImg);
    const [isUploaded, setIsUploaded] = useState(true);

    const storedUserInfo = localStorage.getItem('user_info');
    const userInfo = JSON.parse(storedUserInfo);
    const userId = userInfo.userId;

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");
        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}` // Authorization 헤더에 JWT 포함
            }
        };

        axios.get("http://155.230.43.12:8090/normalUser/user/detail", config)
            .then(response =>{
                setUserData(response.data);
                console.log("userData", response.data);
                // 수정된 데이터 초기화
                setUpdatedUserData(response.data);
            })
            .catch(error =>{
                console.log('Error fetching user data:', error);
            });
    }, []);


    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const response = await fetch(`http://218.233.221.147:8080/User/getProfileImage?userId=${userId}`);
                if (response.ok) {
                    const blob = await response.blob();
                    if (blob.size > 0) {
                        const imageUrl = URL.createObjectURL(blob);
                        setUserImg(imageUrl);
                        setIsUploaded(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, [userId]);


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
        axios.patch("http://155.230.43.12:8090/normalUser/modify", JSON.stringify(data), config)
            .then(response => {
                console.log("수정 성공:", response.data);
                alert("수정되었습니다."); // 수정 성공 알림창
            })
            .catch(error => {
                console.error("수정 실패:", error);
            });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          setSelectedFile(file);
          setUserImg(URL.createObjectURL(file));
          await handleImgSubmit(file);
        }
      };
    
      const handleButtonClick = () => {
        document.getElementById('fileInput').click();
      };
    
      const handleImgSubmit = async (file) => {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('file', file);
    
        try {
          const response = await fetch('http://218.233.221.147:8080/User/uploadProfileImage', {
            method: 'POST',
            body: formData,
          });
    
          if (response.ok) {
            alert('이미지 업로드를 성공하였습니다.');
          } else {
            alert('이미지 업로드를 실패하였습니다.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('서버 오류가 발생했습니다.');
        }
      };
    



    

    return (
        <div className="mypage_detail_container">
            <div className="mypagedetail">
                <div className="mypage_detail_profile">
                    <img className={isUploaded ? 'initialProfileImg' : 'uploadedProfileImg'} src={userImg} alt="User Image" />
                </div>
                <div className="mypage_detail_button_div">
                <button onClick={handleButtonClick}>사진 변경</button>
                <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange}/>
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
