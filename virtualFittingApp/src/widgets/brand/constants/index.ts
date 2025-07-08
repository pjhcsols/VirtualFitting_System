import type { Color, Material, Size } from "@/shared";

export const ProductCreationSystemMessage = {
  NO_MAIN_PHOTO: "상품 사진이 업로드되지 않았습니다!\n다시 한번 확인해주세요!",
  OVER_MAIN_PHOTO: "상품 사진은 최대 9장까지 가능합니다!",
  NO_SUB_PHOTO:
    "상품 설명 사진이 업로드되지 않았습니다!\n다시 한번 확인해주세요!",
  OVER_SUB_PHOTO: "상품 설명 사진은 최대 5장까지 가능합니다!",
  MODIFY_PHOTO_ERR: "여러 장의 사진 입력은 수정 시에 불가능합니다!",
  PHOTO_ERR: "상품 사진에 문제가 있습니다.",
};

export const Colors: Color[] = [
  "BLACK",
  "WHITE",
  "GRAY",
  "BLUE",
  "RED",
  "YELLOW",
  "GREEN",
  "ORANGE",
];

export const Sizes: Size[] = ["XX", "S", "M", "L", "XL"];

export const Materials: Material[] = [
  "COTTON",
  "POLYESTER",
  "WOOL",
  "FABRIC",
  "SILK",
];
