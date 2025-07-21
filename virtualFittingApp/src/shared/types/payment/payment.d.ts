export type ProductSize = "XX" | "S" | "M" | "L" | "XL" | "F";

export type ProductColorMap =
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
  productSize: ProductSize;
  productColor: ProductColorMap;
}

export interface PaymentResponse {
  taskId: string;
  delayTime: string;
}