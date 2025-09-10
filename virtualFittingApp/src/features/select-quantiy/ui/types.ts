export interface QuantityProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  unitPrice: number;
  discountedPrice?: number;
}