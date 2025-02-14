import CloseIcon from "/svg/closeIcon.svg";

export const ICON_CLOSE = CloseIcon;

export const materialsOptions = [
  "COTTON",
  "POLYESTER",
  "WOOL",
  "FABRIC",
  "SILK",
];

export const sizeOptions = ["XX", "S", "M", "L", "XL"];

export const colorOptions = [
  "BLACK",
  "WHITE",
  "GRAY",
  "BLUE",
  "RED",
  "YELLOW",
  "GREEN",
  "ORANGE",
];

export const categoryOptions = [
  { key: 1, value: "티셔츠" },
  { key: 2, value: "긴팔" },
  { key: 3, value: "블라우스" },
  { key: 4, value: "니트" },
  { key: 5, value: "후드티" },
  { key: 6, value: "청바지" },
  { key: 7, value: "슬랙스" },
  { key: 8, value: "반바지" },
  { key: 9, value: "스커트" },
  { key: 10, value: "자켓" },
  { key: 11, value: "가디건" },
  { key: 12, value: "패딩" },
  { key: 13, value: "베스트" },
  { key: 14, value: "드레스" },
  { key: 15, value: "정장" },
  { key: 16, value: "한복" },
  { key: 17, value: "속옷" },
  { key: 18, value: "수영복" },
  { key: 19, value: "액세서리" },
];

export const PRODUCT_CREATION_SYSTEM_MESSAGE = [
  {
    id: 0,
    title: "상품 이름",
    description: ["최대 50자까지 가능합니다. ( 특수문자 삽입 불가 )"],
  },
  {
    id: 1,
    title: "가격",
    description: ["최대 10,000,000원까지 상정이 가능합니다."],
  },
  {
    id: 2,
    title: "재고량",
    description: [
      "재고량과 관련해서 BASILIUM은 관여를 하지 않습니다. 정확한 수량을 입력해주세요.",
    ],
  },
  {
    id: 3,
    title: "연관이 있는 제품을 골라주세요. ( 최대 4개 )",
    description: ["연관 상품들은 자신의 브랜드에 한해서 선택이 가능합니다."],
  },
  {
    id: 4,
    title: "사이즈 테이블",
    description: ["XX / S / M / L / XL 까지 설정이 가능합니다."],
  },
];
