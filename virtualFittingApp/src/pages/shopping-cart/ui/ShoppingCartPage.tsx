import React from "react";
import { Header } from "@/shared/components/header/ui/Header";
import ShoppingCart from "@/shared/components/shopping-cart/ui/ShoppingCart";
import LikedCarousel from "@/shared/components/liked-carousel/ui/LikedCarousel";
import useShoppingCartData from "../utils/items.util";

const ShoppingCartPage = () => {
  const { shoppingData, likedItems } = useShoppingCartData();

  return (
    <div>
      <Header />
      <ShoppingCart shoppingData={shoppingData} />
      <LikedCarousel likedItems={likedItems} />
    </div>
  );
};

export default ShoppingCartPage;
