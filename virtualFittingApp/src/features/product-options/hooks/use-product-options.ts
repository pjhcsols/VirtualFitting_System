import { useState, useMemo } from "react";
import { SIZE_ORDER } from "@/shared";
import type { ProductDetail } from "@/entities/product/model/types";
import type { ProductColorPayment, ProductSizePayment } from "@/entities/payment/model/types";

export const useProductOptions = (product: ProductDetail, onColorChange?: (color: string) => void) => {
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ProductColorPayment>(
    product.productImages.productColor as ProductColorPayment
  );  
  const [selectedSize, setSelectedSize] = useState<ProductSizePayment>(() => 
    product.productOptions.find(opt => opt.productColor === product.productImages.productColor)?.productSize as ProductSizePayment
  );
  
  const sizesSorted = useMemo(() => product.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize as ProductSizePayment)
    .sort((a, b) => (SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))), [product.productOptions, selectedColor]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color as ProductColorPayment);
    const newSize = product.productOptions.find(opt => opt.productColor === color)?.productSize as ProductSizePayment;
    if (newSize) setSelectedSize(newSize);
    
    onColorChange?.(color);
  };

  const handleSetSelectedSize = (size: string) => {
    setSelectedSize(size as ProductSizePayment); 
  };

  return {
    quantity, setQuantity,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize: handleSetSelectedSize,
    
    sizesSorted,
    
    handleColorChange,
  };
};