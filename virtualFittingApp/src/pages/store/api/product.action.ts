import { products } from "../constants/dummy";

const applyDiscount = (product: any) => {
  const originalPrice = parseInt(product.price.replace(/,/g, ""));
  const discountedPrice = product.discountRate
    ? Math.floor(originalPrice * (1 - product.discountRate / 100))
    : originalPrice;

  return {
    ...product,
    discountedPrice: discountedPrice.toLocaleString()
  };
};

export const fetchProducts = () => {
  const productsWithDiscount = products.map(applyDiscount);
  return productsWithDiscount;
};