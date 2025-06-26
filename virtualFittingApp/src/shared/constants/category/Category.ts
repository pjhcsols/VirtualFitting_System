import { type CategoryType } from "@/shared/types";

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
