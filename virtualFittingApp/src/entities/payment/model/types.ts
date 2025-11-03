export type ProductSizePayment = "XX" | "S" | "M" | "L" | "XL" | "F";
export type ProductColorPayment = "BLACK" | "WHITE" | "GRAY" | "BLUE" | "RED" | "YELLOW" | "GREEN" | "ORANGE";

export interface ReservedItem {
  productId: number;
  count: number;
  productSize: ProductSizePayment;
  productColor: ProductColorPayment;
}

export interface PaymentRequestParams extends ReservedItem {
  userId: string;
}

export interface BatchPaymentRequestBody {
  items: ReservedItem[];
}

export interface PaymentReservationData {
  reserveTaskOrderPayId: string;
  expiresAt: string;
  items: ReservedItem[];
}

export interface PaymentReservationStatus {
  reserveTaskOrderPayId: string;
  status: "ACTIVATED" | "INACTIVE";
  expiresAt: string;
}

export interface PaymentResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: PaymentReservationData;
}

export interface PaymentIntentLine {
  productId: number;
  size: ProductSizePayment; 
  color: ProductColorPayment;
  quantity: number;
  couponWalletId?: number;
}

export interface PaymentIntentRequest {
  orderId: string;
  currency: string;
  pointsToUse?: number;
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

export interface PaymentConfirmParams {
  paymentType: string;
  amount: number;
  orderId: string;
  paymentKey: string;
}

export interface PaymentFailParams {
  code: string;
  message: string;
  orderId: string;
}

export interface ReportPaymentResultParams {
  reserveTaskOrderPayId: string;
  success: boolean;
}
