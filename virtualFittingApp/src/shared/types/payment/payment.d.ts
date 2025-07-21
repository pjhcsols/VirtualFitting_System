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
  productId: number;
  count: number;
  productSize: ProductSizePayment;
  productColor: ProductColorPayment;
}

export interface PaymentResponse {
  taskId: string;
  delayTime: string;
}