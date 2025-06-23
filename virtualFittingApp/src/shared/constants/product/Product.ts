import type { Color, Material, Size, SizeTable } from "@/shared/types";

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
