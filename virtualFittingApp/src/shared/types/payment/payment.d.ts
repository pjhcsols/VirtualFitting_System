export type ProductSizePayment = "XX" | "S" | "M" | "L" | "XL" | "F";

export type ProductColorPayment =
  | "BLACK"
  | "WHITE"
  | "GRAY"
  | "BLUE"
  | "RED"
  | "YELLOW"
  | "GREEN"
  | "ORANGE";

export interface PaymentRequestParams {
  userId: string; 
  productId: number;
  count: number;
  productSize: ProductSizePayment;
  productColor: ProductColorPayment;
}

export interface PaymentData {
  reserveTaskOrderPayId: string;
  expiresAt: string;
  items: {
    productId: number;
    count: number;
    productSize: ProductSizePayment;
    productColor: ProductColorPayment;
  }[];
}

export interface PaymentResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: PaymentData;
}

export interface PaymentResultParams {
  taskId: string;
  success: boolean;
}

export interface PaymentConfirmParams {
  paymentKey: string;
  orderId: string;
  amount: number;
  paymentType: string;
}

export interface PaymentIntentLine {
  productId: number;
  size: string;
  color: string;
  quantity: number;
  couponWalletId?: number;
}

export interface PaymentIntentRequest {
  orderId: string;
  currency: number;
  pointsToUse: number;
  lines: PaymentIntentLine[];
  expiresAt: string;
}

export interface PaymentIntentData {
  paymentId: number;
  orderId: string;
  serverTotal: number;
  pointsToUse: number;
  pgAmount: number;
  intentExpiresAt: string;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: T;
}