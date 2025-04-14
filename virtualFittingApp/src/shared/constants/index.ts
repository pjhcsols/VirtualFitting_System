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
import Like from "/svg/like.svg";
import Share from "/svg/share.svg";
import { type CategoryType } from "@/shared/types/product/category";

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

export const CategoryIndex = [
  {
    name: "Top",
    innerCategory: [1, 2, 3, 4, 5, 13],
  },
  {
    name: "Outer",
    innerCategory: [10, 11, 12],
  },
  {
    name: "Bottom",
    innerCategory: [6, 7, 8, 9],
  },
  {
    name: "Bag & Acc",
    innerCategory: [19],
  },
  {
    name: "T-Shirts",
    innerCategory: [1],
  },
  {
    name: "Long Sleeves",
    innerCategory: [2],
  },
  {
    name: "blouse",
    innerCategory: [3],
  },
  {
    name: "knitwear",
    innerCategory: [4],
  },
  {
    name: "hood",
    innerCategory: [5],
  },
  {
    name: "vest",
    innerCategory: [13],
  },
  {
    name: "jacket",
    innerCategory: [10],
  },
  {
    name: "cardigan",
    innerCategory: [11],
  },
  {
    name: "padding",
    innerCategory: [12],
  },
  {
    name: "jeans",
    innerCategory: [6],
  },
  {
    name: "slacks",
    innerCategory: [7],
  },
  {
    name: "shorts",
    innerCategory: [8],
  },
  {
    name: "skirt",
    innerCategory: [9],
  },
  {
    name: "accessories",
    innerCategory: [19],
  },
];

export const CategoryMapping: Record<number, CategoryType> = {
  1: "티셔츠",
  2: "긴팔",
  3: "블라우스",
  4: "니트",
  5: "후드티",
  6: "청바지",
  7: "슬랙스",
  8: "반바지",
  9: "스커트",
  10: "자켓",
  11: "가디건",
  12: "패딩",
  13: "베스트",
  14: "드레스",
  15: "정장",
  16: "한복",
  17: "속옷",
  18: "수영복",
  19: "악세서리",
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
