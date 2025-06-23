import Basilium3DLogo from "/img/logo/Basilium3DLogo.png";
import WarningImg from "/img/warning/Warning.png";
import TestImg from "/img/clothes/testPants.png";
import BasiliumIcon from "/img/logo/BasiliumLogo.svg";

import SearchIcon from "/svg/SearchIcon.svg";
import LeftArrow from "/svg/LeftArrow.svg";
import RightArrow from "/svg/RightArrow.svg";
import ReviewImg from "/svg/pencil.svg";
import CloseIcon from "/svg/closeIcon.svg";
import UploadIcon from "/svg/UploadAsset.svg";
import Plus from "/svg/plus.svg";
import AI from "/svg/ai.svg";
import UnLiked from "/svg/like.svg";
import Liked from "/svg/liked.svg";
import Share from "/svg/share.svg";
import Loading from "/svg/loading.svg";
import BasiliumSVGLogo from "/svg/BasiliumLogo.svg";
import UploadSVGLogo from "/svg/UploadIcon.svg";
import EmailSVGLogo from "/svg/Email.svg";
import BasiliumAsset1 from "/svg/basiliumAsset_1.svg";

export const IMG_BASILIUM_3D_LOGO = Basilium3DLogo;
export const IMG_WARNING = WarningImg;

export const IMG_TEST_CLOTHES = TestImg;

export const ICON_BASILIUM = BasiliumIcon;
export const ICON_SEARCH = SearchIcon;
export const ICON_LEFT_ARROW = LeftArrow;
export const ICON_RIGHT_ARROW = RightArrow;
export const ICON_REVIEW = ReviewImg;
export const ICON_CLOSE = CloseIcon;
export const ICON_UPLOAD = UploadIcon;
export const ICON_PLUS = Plus;
export const ICON_SHARE = Share;
export const ICON_LOADING = Loading;
export const ICON_AI = AI;
export const ICON_BASILIUM_LOGO = BasiliumSVGLogo;
export const ICON_UPLOAD_ICON = UploadSVGLogo;
export const ICON_EMAIL = EmailSVGLogo;
export const ICON_LIKED = Liked;
export const ICON_UNLIKED = UnLiked;
export const ICON_BASILIUM_ASSET_1 = BasiliumAsset1;

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
/*
 * responsible Design GuideLine
 */

// 2XL
export const xlDouble = 1536;

// XL
export const xl = 1280;

// lg
export const lg = 1024;

// md
export const md = 768;

// sm
export const sm = 640;

export * from "@/shared/constants/color/Colors";

export * from "@/shared/constants/category/Category";

export * from "@/shared/constants/product/Product";

export * from "@/shared/constants/icon/Icon";
