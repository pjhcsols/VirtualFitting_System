import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/login.action";
import {
  Wrapper,
  LogoContainer,
  LogoTitle,
  InputContainer,
  InputBox,
  InputLabel,
  TextInput,
  StepButton,
} from "./LogInStyles";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        userId: email,
        userPassword: password,
      });

      console.log("로그인 성공! 토큰:", response.token);
      alert(`환영합니다! 로그인 타입: ${response.type}`);

      navigate("/");
    } catch (error) {
      const err = error as Error;
      console.error("로그인 실패:", err.message);
    }
  };

  return (
    <Wrapper>
      <LogoContainer>
        <LogoTitle>Basilium</LogoTitle>
      </LogoContainer>
      <InputContainer>
        <InputBox>
          <InputLabel htmlFor="emailAddress">Email</InputLabel>
          <TextInput
            type="text"
            id="emailAddress"
            name="emailAddress"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 입력값 업데이트
            required
          />
        </InputBox>
        <InputBox>
          <InputLabel htmlFor="password">Password</InputLabel>
          <TextInput
            type="password"
            id="password"
            name="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 입력값 업데이트
            required
          />
        </InputBox>
        <StepButton to={"."} onClick={handleLogin}>
          Log In
        </StepButton>
      </InputContainer>
    </Wrapper>
  );
};

export default LogInPage;
