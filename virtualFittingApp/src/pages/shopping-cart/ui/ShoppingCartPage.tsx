import { Header, ShoppingCart, LikedCarousel } from "@/shared";
import { useShoppingCartData } from "@/pages/shopping-cart/utils/items.util";

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

export { ShoppingCartPage };
