import { useNavigate } from 'react-router-dom';
import { ICON_FIRM, ICON_USER } from "../constants";
import './LogInPage.css';

const SignUpForm = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => navigate(path);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="vertical-group">
        <img src={ICON_USER} alt="normal" className="user-icon" />
        <button className="signupButton" onClick={() => handleClick('/Signup_User')}>일반회원</button>
      </div>
      <div className="vertical-group">
        <img src={ICON_FIRM} alt="firm" className="firm-icon" />
        <button className="signupButton" onClick={() => handleClick('/Signup_Brand')}>사업자</button>
      </div>
    </div>
  );
};

export default SignUpForm;
