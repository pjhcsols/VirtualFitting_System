import { useState, useEffect } from "react";
import { Cookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth'; 
import { useNavigate } from "react-router-dom";
import { fetchDiscountQuote } from "@/entities/discount";
import type { ProductDetail } from "@/entities/product/model/types";
import { useAddToCart } from '@/features/add-to-cart';
import { useInitiateCheckout } from "@/features/initiate-checkout-single";
import { useProductOptions } from '@/features/product-options';

const cookiesInstance = new Cookies();

export const useProductDetails = (product: ProductDetail, onColorChange?: (color: string) => void) => {
  const isLoggedIn = useRecoilValue(authState);
  const navigate = useNavigate();

  const [price, setPrice] = useState<{ original: number; discounted?: number } | null>(null);
  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls?.[0] ?? '');
  const [showPaymentTab, setShowPaymentTab] = useState(false);

  const {
    quantity, setQuantity,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    sizesSorted,
    handleColorChange,
  } = useProductOptions(product, onColorChange);
  
  const { initiateCheckout, isLoading: paymentLoading } = useInitiateCheckout();

  useEffect(() => {
    setMainImage(product.productImages.productPhotoUrls?.[0] ?? '');
  }, [product]);

  useEffect(() => {
    const accessToken = cookiesInstance.get('access-token');
    fetchDiscountQuote({ productId: product.productId, userId: accessToken })
      .then(quote => {
        if (quote?.data) setPrice({ original: quote.data.baseUnitPrice, discounted: quote.data.finalUnitPrice });
      })
      .catch(err => console.error("Failed to fetch discount quote", err));
  }, [product.productId]);

  const selectedProductImages = product.productImages?.productPhotoUrls ?? [];

  // const finalPrice = useMemo(() => {
  //   if (!price) return 0;
  //   const basePrice = (price.discounted ?? price.original) * quantity;
  //   if (!selectedCoupon) return basePrice;
  //   let couponDiscount = basePrice * (selectedCoupon.percent / 100);
  //   if (couponDiscount > selectedCoupon.maxDiscountPrice) couponDiscount = selectedCoupon.maxDiscountPrice;
  //   return Math.round(basePrice - couponDiscount);
  // }, [price, quantity, selectedCoupon]);

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    const authUserId = cookiesInstance.get('access-token');
    if (!authUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    const itemData = {
      productId: product.productId,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      brandUserNumber: product.brandUser.userNumber,
      brandFirmName: product.brandUser.firmName,
    };

    addToCart({ authUserId, itemData });
  };

  const handlePurchaseClick = () => {

    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    if (!price) return;

    initiateCheckout({
      id: product.productId,
      productId: product.productId,
      name: product.productName,
      brand: product.brandUser.firmName,
      image: selectedProductImages[0],
      price: price.original,
      discountedPrice: price.discounted,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    });
  };
  
  return {
    price, quantity, showPaymentTab, paymentLoading,
    selectedColor, selectedSize, mainImage, sizesSorted, selectedProductImages, 
    isAddingToCart,
    setQuantity, setShowPaymentTab, setSelectedColor, setSelectedSize, setMainImage,
    handleAddToCart, handlePurchaseClick, handleColorChange,
  };
};
