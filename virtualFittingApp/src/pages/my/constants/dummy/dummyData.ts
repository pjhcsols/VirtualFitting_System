import { OrderItem } from "@/pages/my/types/order";


export const orderDummyData: OrderItem[] = [
  {
    id: "1", 
    date: "2025-01-20",
    brand: "BASILIUM",
    productName: "클래식 B 루즈핏 티셔츠",
    options: {
      color: "black",
      size: "XL",
      quantity: 1,
    },
    price: 42000,
    productImageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20250429/5075611/5075611_17459941111610_big.jpg?w=1200",
    category: "교환",
    
  },
  {
    id: "2", 
    date: "2025-01-18",
    brand: "NIKE",
    productName: "에어포스 1",
    options: {
      color: "white",
      size: "270",
      quantity: 1,
    },
    price: 129000,
    productImageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20240321/3976350/3976350_17115804993997_big.jpg?w=1200",
    category: "교환",

  },
  {
    id: "3", 
    date: "2025-01-15",
    brand: "ADIDAS",
    productName: "슈퍼스타 오리지널",
    options: {
      color: "black:white",
      size: "275",
      quantity: 2,
    },
    price: 200000,
    productImageUrl: "https://image.msscdn.net/thumbnails/images/goods_img/20200924/1622069/1622069_1_big.jpg?w=1200",
    category: "취소/반품",
  },
];
