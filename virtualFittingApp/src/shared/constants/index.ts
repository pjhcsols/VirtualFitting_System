import Basilium3DLogo from "/img/logo/Basilium3DLogo.png";
import WarningImg from "/img/warning/Warning.png";
import TestImg from "/img/clothes/testPants.png";
import BasiliumIcon from "/img/logo/BasiliumLogo.svg";
import Gradient from "/img/aibutton/gradient.png";

import SearchIcon from "/svg/SearchIcon.svg";
import LeftArrow from "/svg/LeftArrow.svg";
import RightArrow from "/svg/RightArrow.svg";
import ReviewImg from "/svg/pencil.svg";
import CloseIcon from "/svg/closeIcon.svg";
import UploadIcon from "/svg/UploadAsset.svg";
import Plus from "/svg/plus.svg";
import Minus from "/svg/minus.svg";
import AI from "/svg/ai.svg";
import UnLiked from "/svg/like.svg";
import Liked from "/svg/liked.svg";
import Share from "/svg/share.svg";
import Loading from "/svg/loading.svg";
import BasiliumSVGLogo from "/svg/BasiliumLogo.svg";
import UploadSVGLogo from "/svg/UploadIcon.svg";
import EmailSVGLogo from "/svg/Email.svg";
import BasiliumAsset1 from "/svg/basiliumAsset_1.svg";
import Bag from "/svg/bag.svg";
import User from '/svg/user.svg';
import Menu from '/svg/menu.svg';


import type {
  CategoryType,
  Color,
  Material,
  Size,
  SizeTable,
} from "@/shared/types";


export const IMG_BASILIUM_3D_LOGO = Basilium3DLogo;
export const IMG_WARNING = WarningImg;

export const IMG_TEST_CLOTHES = TestImg;
export const IMG_GRADIENT = Gradient;

export const ICON_BASILIUM = BasiliumIcon;
export const ICON_SEARCH = SearchIcon;
export const ICON_LEFT_ARROW = LeftArrow;
export const ICON_RIGHT_ARROW = RightArrow;
export const ICON_REVIEW = ReviewImg;
export const ICON_CLOSE = CloseIcon;
export const ICON_UPLOAD = UploadIcon;
export const ICON_PLUS = Plus;
export const ICON_MINUS = Minus;
export const ICON_SHARE = Share;
export const ICON_LOADING = Loading;
export const ICON_AI = AI;
export const ICON_BASILIUM_LOGO = BasiliumSVGLogo;
export const ICON_UPLOAD_ICON = UploadSVGLogo;
export const ICON_EMAIL = EmailSVGLogo;

export const ICON_BAG = Bag;
export const ICON_USER = User;
export const ICON_MENU = Menu;

export const ICON_LIKED = Liked;
export const ICON_UNLIKED = UnLiked;

export const ICON_BASILIUM_ASSET_1 = BasiliumAsset1;

export const API_BASE_URL = "http://211.211.22.130:8080";

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

export const palleteList: Color[] = [
  "BLACK",
  "WHITE",
  "GRAY",
  "BLUE",
  "RED",
  "YELLOW",
  "GREEN",
  "ORANGE",
];

export const COLOR_MAP: Record<string, string> = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",
  RED: "#FF0000",
  GREEN: "#06923E",
  BLUE: "#00B8FF",
  YELLOW: "#FFEE58",
  MAGENTA: "#FF00FF",
  CYAN: "#00FFFF",
  GRAY: "#808080",
  MAROON: "#800000",
  DARKGREEN: "#008000",
  NAVY: "#000080",
  ORANGE: "#FF4F0F",
  BROWN: "#A52A2A",
  PINK: "#F564A9",
  GOLD: "#FFD700",
};


export const materialList: Material[] = [
  "COTTON",
  "POLYESTER",
  "WOOL",
  "FABRIC",
  "SILK",
];

export const SizeTableTitles: (keyof SizeTable)[] = [
  "productTotalLength",
  "productChest",
  "productShoulder",
  "productArm",
];

export const OptionTitles = ["SIZE", "INFO", "FAQ", "고객지원"];

export const Sizes: Size[] = ["S", "M", "L", "XL", "XX"];

export const CheckOptions: string[] = [
  "사진이 올바르게 업로드 되어있습니다.",
  "상품의 제목, 가격, 설명이 되어있습니다.",
  "상품의 색감이 설정되어 있습니다.",
  "상품의 소재가 설정되어 있습니다.",
  "상품의 사이즈별 표기가 제대로 되어있습니다.",
  "상품의 카테고리가 올바르게 표기되어 있습니다.",
  "상품의 옵션사진이 제대로 업로드 되어있습니다.",
];


/*
 * responsible Design GuideLine
 */

export const BREAKPOINTS = {
  xlDouble: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
};

export type BreakpointKey = keyof typeof BREAKPOINTS;

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
