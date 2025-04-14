import Basilium3DLogo from "/img/logo/Basilium3DLogo.png";
import WarningImg from "/img/warning/Warning.png";
import TestImg from "/img/clothes/testPants.png";

import SearchIcon from "/svg/SearchIcon.svg";
import LeftArrow from "/svg/LeftArrow.svg";
import RightArrow from "/svg/RightArrow.svg";
import ReviewImg from "/svg/pencil.svg";
import CloseIcon from "/svg/closeIcon.svg";
import UploadIcon from "/svg/UploadAsset.svg";
import Plus from "/svg/plus.svg";
import Like from "/svg/like.svg";
import Share from "/svg/share.svg";

export const IMG_BASILIUM_3D_LOGO = Basilium3DLogo;
export const IMG_WARNING = WarningImg;

export const IMG_TEST_CLOTHES = TestImg;

export const ICON_SEARCH = SearchIcon;
export const ICON_LEFT_ARROW = LeftArrow;
export const ICON_RIGHT_ARROW = RightArrow;
export const ICON_REVIEW = ReviewImg;
export const ICON_CLOSE = CloseIcon;
export const ICON_UPLOAD = UploadIcon;
export const ICON_PLUS = Plus;
export const ICON_LIKE = Like;
export const ICON_SHARE = Share;

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

export const productCategoryIndexing = {
  Top: [1, 2, 3, 4, 5, 13],
  Outer: [10, 11, 12],
  Bottom: [6, 7, 8, 9],
  "Bag & Acc": [19],
  "T-shirts": [1],
  "long sleeves": [2],
  blouse: [3],
  knitwear: [4],
  hood: [5],
  vest: [13],
  jacket: [10],
  cardigan: [11],
  padding: [12],
  jeans: [6],
  slacks: [7],
  shorts: [8],
  skirt: [9],
  accessories: [19],
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
