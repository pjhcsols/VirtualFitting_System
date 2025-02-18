import Basilium3DLogo from "/img/Basilium3DLogo.png";
import SearchIcon from "/svg/SearchIcon.svg";
import LeftArrow from "/svg/LeftArrow.svg";
import RightArrow from "/svg/RightArrow.svg";
import MyPageUser from "/img/MyPageUser.png";
import WarningImg from "/img/Warning.png";

export const IMG_BASILIUM_3D_LOGO = Basilium3DLogo;
export const IMG_MYPAGE_USER = MyPageUser;
export const IMG_WARNING = WarningImg;

export const ICON_SEARCH = SearchIcon;
export const ICON_LEFT_ARROW = LeftArrow;
export const ICON_RIGHT_ARROW = RightArrow;

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
