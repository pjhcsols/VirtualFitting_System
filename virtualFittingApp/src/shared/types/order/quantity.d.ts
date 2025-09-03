export type QuantityBoxProps = {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  unitPrice: number;
  discountedPrice?: number;
};