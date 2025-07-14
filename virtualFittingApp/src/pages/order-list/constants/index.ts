import { OrderData, IMG_TEST_CLOTHES } from "@/shared";


export const dummy: OrderData[] = [
  {
    orderId: "ORD123456",
    orderDate: "2025-07-01",
    productName: "Vintage Black T-shirt",
    photoUrl: IMG_TEST_CLOTHES,
    color: "BLACK",
    size: "M",
    creationTime: "2025-07-01T12:00:00",
    price: 35000,
    totalCnt: 1,
  },
  {
    orderId: "ORD123457",
    orderDate: "2025-07-02",
    productName: "Classic Blue Jeans",
    photoUrl: IMG_TEST_CLOTHES,
    color: "BLUE",
    size: "L",
    creationTime: "2025-07-02T15:00:00",
    price: 65000,
    totalCnt: 2,
  },
  {
    orderId: "ORD123458",
    orderDate: "2025-07-03",
    productName: "Canvas Tote Bag",
    photoUrl: IMG_TEST_CLOTHES,
    color: "IVORY",
    size: "FREE",
    creationTime: "2025-07-03T09:30:00",
    price: 15000,
    totalCnt: 1,
  },
];
