import { useSetRecoilState } from 'recoil';
import { cartState } from '@/entities/cart';
import { type ProductDetail } from "@/entities/product";
import { type ProductColorPayment, type ProductSizePayment } from "@/entities/payment/model/types"; 

interface UseAddToCartProps {
  product: ProductDetail;
  price: { original: number; discounted?: number } | null;
  selectedColor: ProductColorPayment;
  selectedSize: ProductSizePayment;
  quantity: number;
  selectedProductImages: string[];
}

export const useAddToCart = ({ product, price, selectedColor, selectedSize, quantity, selectedProductImages }: UseAddToCartProps) => {
  const setCartItems = useSetRecoilState(cartState);

  const handleAddToCart = () => {
    if (!price) return;

    const newItem = {
      id: `${product.productId}-${selectedColor}-${selectedSize}`,
      productId: product.productId,
      name: product.productName,
      brand: product.brandUser.firmName,
      image: selectedProductImages[0],
      price: price.discounted ?? price.original,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === newItem.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  return { handleAddToCart };
};
