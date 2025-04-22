export interface OrderItem {
    id: number;
    date: string; 
    brand: string;
    productName: string;
    options: {
      color: string;
      size: string;
      quantity: number;
    };
    price: number;
    productImageUrl: string;
  }