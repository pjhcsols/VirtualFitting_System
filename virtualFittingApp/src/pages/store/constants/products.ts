import type { Product } from "@/shared";

export const products: Product[] = [
  {
    productId: 1,
    productName: "프리미엄 코튼 셔츠",
    productPrice: 49000,
    totalQuantity: 120,
    categoryName: "상의",
    productColors: ["white", "skyblue", "navy"],
    productPhotoUrls: [
      "https://example.com/images/shirt1.jpg",
      "https://example.com/images/shirt1-back.jpg"
    ]
  },
  {
    productId: 2,
    productName: "슬림핏 데님 팬츠",
    productPrice: 59000,
    totalQuantity: 80,
    categoryName: "하의",
    productColors: ["blue", "black"],
    productPhotoUrls: [
      "https://example.com/images/jeans1.jpg"
    ]
  }
];
