import React from "react";
import Header_Bottom from "@/shared/components/header/header-bottom/HeaderBottom";
import ShoppingCart from "@/shared/components/shopping-cart/ui/ShoppingCart";
import LikedCarousel from "@/shared/components/liked-carousel/ui/LikedCarousel";
import useShoppingCartData from "../utils/items.util";

const ShoppingCartPage = () => {
  const { shoppingData, likedItems } = useShoppingCartData();

  return (
    <div>
      <Header_Bottom />
      <ShoppingCart shoppingData={shoppingData} />
      <LikedCarousel likedItems={likedItems} />
    </div>
  );
};

export default ShoppingCartPage;
