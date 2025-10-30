import { useState, useEffect, useMemo } from "react";
import { Cookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth'; 
import { useNavigate } from "react-router-dom";

import { SIZE_ORDER } from "@/shared";
import { fetchDiscountQuote } from "@/entities/discount";
import type { ProductDetail } from "@/entities/product/model/types";
import type { ProductColorPayment, ProductSizePayment } from "@/entities/payment/model/types";
import type { AddCartItemRequest } from '@/entities/cart';

import { useAddToCart } from '@/features/add-to-cart';
import { useInitiateCheckout } from "@/features/initiate-checkout-single";

const cookiesInstance = new Cookies();

export const useProductDetails = (product: ProductDetail, onColorChange?: (color: string) => void) => {
  // const [cookies] = useCookies(['access-token']);
  const isLoggedIn = useRecoilValue(authState);
  const navigate = useNavigate();

  const [price, setPrice] = useState<{ original: number; discounted?: number } | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState<ProductColorPayment>(product.productImages.productColor as ProductColorPayment);  
  const [selectedSize, setSelectedSize] = useState(() => 
    product.productOptions.find(opt => opt.productColor === product.productImages.productColor)?.productSize as ProductSizePayment
  );
  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls?.[0] ?? '');

  const [showPaymentTab, setShowPaymentTab] = useState(false);
  
  const { initiateCheckout, isLoading: paymentLoading } = useInitiateCheckout();

  useEffect(() => {
    setSelectedColor(product.productImages.productColor as ProductColorPayment); 
    setSelectedSize(product.productOptions.find(opt => opt.productColor === product.productImages.productColor)?.productSize as ProductSizePayment);
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

  const sizesSorted = useMemo(() => product.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize as ProductSizePayment)
    .sort((a, b) => (SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))), [product.productOptions, selectedColor]);

  const selectedProductImages = product.productImages?.productPhotoUrls ?? [];


  // const finalPrice = useMemo(() => {
  //   if (!price) return 0;
  //   const basePrice = (price.discounted ?? price.original) * quantity;
  //   if (!selectedCoupon) return basePrice;
  //   let couponDiscount = basePrice * (selectedCoupon.percent / 100);
  //   if (couponDiscount > selectedCoupon.maxDiscountPrice) couponDiscount = selectedCoupon.maxDiscountPrice;
  //   return Math.round(basePrice - couponDiscount);
  // }, [price, quantity, selectedCoupon]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color as ProductColorPayment);
    const newSize = product.productOptions.find(opt => opt.productColor === color)?.productSize as ProductSizePayment;
    if (newSize) setSelectedSize(newSize);
    
    onColorChange?.(color);
  };

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    const authUserId = cookiesInstance.get('access-token');
    if (!authUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }
    
    const itemData: AddCartItemRequest = {
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
    setQuantity, setShowPaymentTab, setSelectedSize, setMainImage,
    handleAddToCart, handlePurchaseClick, handleColorChange,
  };
};