import { type Flag } from "../types/auth";
import { Korea, Japan } from "../components/icon/index";
import { TErrorResponse } from "@/shared/event";

export const TitleArray = [
  "Basilium 이용약관 동의",
  "회원가입 정보 기입",
  "추가정보 기입",
];

export const Flags: Flag[] = [
  {
    country: "KOR",
    countryCode: "+82)",
    countryIcon: Korea,
  },
  {
    country: "JPN",
    countryCode: "+81)",
    countryIcon: Japan,
  },
  {
    country: "AME",
    countryCode: "+1",
    countryIcon: Japan,
  },
];

// * Auth Status

const AUTH_ERROR_STATUS: Map<string, TErrorResponse> = new Map();

AUTH_ERROR_STATUS.set("CANNOT_SIGN_UP", {
  message: "회원가입을 하지 못하였습니다.",
});

export { AUTH_ERROR_STATUS };

// * Login Status

type TLoginErrorKey = "WRONG_PASSWORD" | "NO_USER" | "SERVER_ERROR";

const LOGIN_ERROR_STATUS: Map<TLoginErrorKey, TErrorResponse> = new Map();

LOGIN_ERROR_STATUS.set("WRONG_PASSWORD", {
  message: "비밀번호가 잘못되었습니다.",
});

LOGIN_ERROR_STATUS.set("NO_USER", {
  message: "유저를 찾을 수 없습니다.",
});

LOGIN_ERROR_STATUS.set("SERVER_ERROR", {
  message: "서버 오류 발생",
});

export { LOGIN_ERROR_STATUS };
