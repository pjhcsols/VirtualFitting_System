export interface ProductOrderListProps {
    orderData: {
      productName: string;
      photoUrl: string;
      color: string;
      size: string;
      creationTime: string;
      price: number;
      totalCnt: number;
    }[];
    isOrderListPage: boolean;
  }
  