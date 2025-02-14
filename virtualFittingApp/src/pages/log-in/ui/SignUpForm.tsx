import { useNavigate } from 'react-router-dom';
import normalImg from '../../assets/img/normal.png';
import firmImg from '../../assets/img/firm.png';
import './LoginPage.css';

const SignUpForm = () => {
  const navigate = useNavigate();

  const handleClick = (path: string) => navigate(path);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="vertical-group">
        <img src={normalImg} alt="normal" className="normal-img" />
        <button className="signupButton" onClick={() => handleClick('/Signup_User')}>일반회원</button>
      </div>
      <div className="vertical-group">
        <img src={firmImg} alt="firm" className="normal-img" />
        <button className="signupButton" onClick={() => handleClick('/Signup_Brand')}>사업자</button>
      </div>
    </div>
  );
};

export default SignUpForm;
