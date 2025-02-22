import Basilium3DLogo from "/img/Basilium3DLogo.png";
import SearchIcon from "/svg/SearchIcon.svg";
import LeftArrow from "/svg/LeftArrow.svg";
import RightArrow from "/svg/RightArrow.svg";
import MyPageUser from "/img/MyPageUser.png";
import WarningImg from "/img/Warning.png";
import ReviewImg from "/svg/pencil.svg";
import TestImg from "/img/clothes/testPants.png";
import CloseIcon from "/svg/closeIcon.svg";

export const IMG_BASILIUM_3D_LOGO = Basilium3DLogo;
export const IMG_MYPAGE_USER = MyPageUser;
export const IMG_WARNING = WarningImg;

export const IMG_TEST_CLOTHES = TestImg;

export const ICON_SEARCH = SearchIcon;
export const ICON_LEFT_ARROW = LeftArrow;
export const ICON_RIGHT_ARROW = RightArrow;
export const ICON_REVIEW = ReviewImg;
export const ICON_CLOSE = CloseIcon;

export const AnimationProps = {
  initial: {
    opacity: 0,
    y: -20,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
  transition: {
    duration: 0.3,
  },
};

export const SYSTEM_MESSAGE = {
  page_error: {
    "400": "페이지의 요청이 잘못되었습니다.",
    "404": "페이지를 찾을 수 없습니다.",
    "500": "서버가 불안정합니다.",
  },
  purchase_error: {
    "400": "결제가 실패하였습니다.",
    "500": "잠시 후 다시 요청해주세요",
  },
};
