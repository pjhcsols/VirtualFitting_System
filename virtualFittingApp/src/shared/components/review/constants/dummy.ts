import { IMG_TEST_CLOTHES } from "@/shared";

// type Review = {
//   id: number;
//   rating: number;
//   createdAt: string;
//   userId: string;
//   option: string;
//   height: number;
//   weight: number;
//   size: string;
//   content: string;
//   images?: string[];
// };

export const reviews = [
  {
    id: 1,
    rating: 5,
    createdAt: "2025-05-01T10:15:00Z",
    userId: "happycat01",
    option: "블랙 · L",
    height: 175,
    weight: 68,
    size: "작아요",
    content: "옷이 정말 편하고 예뻐요! 핏도 딱 맞고 재질도 부드러워서 만족합니다.",
    images: [IMG_TEST_CLOTHES, IMG_TEST_CLOTHES],
  },
  {
    id: 2,
    rating: 4,
    createdAt: "2025-05-03T14:22:00Z",
    userId: "cooldog99",
    option: "화이트 · M",
    height: 168,
    weight: 54,
    size: "커요",
    content: "생각보다 얇은 편이지만 여름에 입기 좋을 것 같아요.",
    images: [IMG_TEST_CLOTHES],
  },
  {
    id: 3,
    rating: 3,
    createdAt: "2025-05-05T08:45:00Z",
    userId: "styleme23",
    option: "그레이 · S",
    height: 160,
    weight: 47,
    size: "작아요",
    content: "핏은 괜찮은데 목 부분이 조금 불편했어요.",
  },
  {
    id: 4,
    rating: 5,
    createdAt: "2025-05-10T12:10:00Z",
    userId: "sunnyday",
    option: "네이비 · XL",
    height: 182,
    weight: 85,
    size: "커요",
    content: "사이즈 넉넉해서 좋아요! 배송도 빨랐고 재구매 의사 있습니다.",
    images: [IMG_TEST_CLOTHES, IMG_TEST_CLOTHES, IMG_TEST_CLOTHES],
  },
  {
    id: 5,
    rating: 2,
    createdAt: "2025-05-12T16:00:00Z",
    userId: "choisj92",
    option: "베이지 · M",
    height: 170,
    weight: 60,
    size: "잘 맞아요",
    content: "색상이 화면과 달라서 아쉬웠어요. 교환 고민 중입니다.",
  },
];
