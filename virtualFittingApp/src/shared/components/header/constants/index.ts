import {
  CardIcon,
  GraphIcon,
  HomeIcon,
  SettingIcon,
  ShopIcon,
} from "../../icon";

export const CART_ICON = "/svg/cart.svg";
export const BAG_ICON = "/svg/bag.svg";
export const USER_ICON = "/svg/user.svg";
export const MENU_ICON = "/svg/menu.svg";
export const BACK_ICON = "/svg/back.svg";

export const AdminHeaderContent = [
  {
    id: 0,
    title: "상품 리스트",
    href: "",
  },
  {
    id: 1,
    title: "상품 등록",
    href: "create",
  },
  {
    id: 2,
    title: "AI 세팅",
    href: "setting",
  },
  {
    id: 3,
    title: "로그아웃",
    href: "logout",
  },
];

export const AdminHeaderOptions = [
  {
    id: 0,
    title: "Brand User List",
    href: "/admin",
  },
  {
    id: 1,
    title: "Banner Manage",
    href: "/admin/banner",
  },
  {
    id: 2,
    title: "Product Manage",
    href: "/admin/product",
  },
  {
    id: 3,
    title: "Logout",
    href: "",
  },
];

export const BrandHeaderOptions = [
  {
    id: 0,
    title: "Home",
    href: "/brand/dashboard",
  },
  {
    id: 1,
    title: "Account Settings",
    href: "/brand/dashboard",
  },
  {
    id: 2,
    title: "Payment",
    href: "/brand/dashboard",
  },
  {
    id: 3,
    title: "Product",
    href: "/brand/product",
  },
  {
    id: 4,
    title: "Analytics",
    href: "/brand/dashboard",
  },
];
