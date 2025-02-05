import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import ServerAPI from "../API/ServerAPI";
import "./Redirection.css";

const Redirection = () => {
  const code = new URL(document.location.toString()).searchParams.get('code');
  const navigate = useNavigate();
  const isFirstRun = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchData = async() => {
      const data = {
        'code': code 
      };

      try {
        const response = await ServerAPI.post('/oauth/kakao/login', data);

        if (response.status === 201) {
          localStorage.clear();
          localStorage.setItem('login-token', response.data.accessToken);
          const userInfo = {
            userId: "user1",
            loginType: "kakao"
          };
          localStorage.setItem('user_info', JSON.stringify(userInfo));
          
          navigate('/');
        }
      }
      catch (error) {
        console.log("오류 발생", error);
        console.log(code);
        navigate('/login');
      }
    };

    if (isFirstRun.current) {
      isFirstRun.current = false;
      fetchData();
    }
  });
  
  return (
    <>
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  );
};

export default Redirection;
