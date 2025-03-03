import axios from "axios";

const BASE_URL = import.meta.env.VITE_APPLICATION_CLOUT_URL as string;
const CLOUD_API_KEY = import.meta.env
  .REACT_APP_BUSINESSREGISTRATION_API_KEY as string;

const API_BASILIUM_CLOUD = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const busniessRegisterAPI = async (request: string) => {
  try {
    const req = {
      b_no: [request],
    };
    const res = await API_BASILIUM_CLOUD.post(
      `/v1/status?serviceKey=${CLOUD_API_KEY}`,
      req
    );
    if (res.status === 201) {
      return res.data;
    } else {
      return false;
    }
  } catch (err) {
    return err;
  }
};

const googleClientId = import.meta.env.REACT_APP_GOOGLE_CLIENT_ID as string;
const googleRedirectUrl = import.meta.env
  .REACT_APP_GOOGLE_REDIRECT_URL as string;

export const GoogleLoginAPI = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUrl}&response_type=code&scope=openid email profile`;
  const onClickGoogleLogin = () => {
    window.location.href = googleAuthUrl;
  };

  return {
    onClickGoogleLogin,
  };
};

const restApiKey = import.meta.env.REACT_APP_REST_API_KEY as string;
const redirectUrl = import.meta.env.REACT_APP_KAKAO_REDIRECT_URL as string;

export const KakaoLoginAPI = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUrl}&response_type=code`;
  const onClickKakaoLogin = () => {
    window.location.href = kakaoAuthUrl;
  };
};

const naverClientID = import.meta.env.REACT_APP_NAVER_CLIENT_ID as string;
const naverCallBackUrl = import.meta.env.REACT_APP_NAVER_CALLBACK_URL;

export const NaverLoginAPI = ({ state }: { state: boolean }) => {
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientID}&state=${state}&redirect_uri=${naverCallBackUrl}`;
  const onClickNaverLogin = () => {
    window.location.href = naverAuthUrl;
  };
  return {
    onClickNaverLogin,
  };
};
