import {React, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Redirection = () => {
    const code = window.location.search;
    const navigate = useNavigate();
  
    useEffect(() => {
      console.log(process.env.REACT_APP_URL);
      axios.post(`${process.env.REACT_APP_URL}kakaoLogin${code}`).then((r) => {
        console.log(r.data);
  
        // 토큰을 받아서 localStorage같은 곳에 저장하는 코드를 여기에 쓴다.
        // localStorage.setItem('name', r.data); // 일단 이름만 저장했다.

        navigate('/');
      });
    }, []);
  
    return <div>로그인 중입니다.</div>;
  };
  
  export default Redirection;