import "./App.css";

import { BrowserRouter } from "react-router-dom";

import { UserSignUpAnimationRouter } from "@/app/signup/UserSignUpAnimationRouter";
import { StoreRouter } from "@/app/store/StoreRouter";
import { AdminRouter } from "@/app/admin/AdminRouter";
import { AboutRouter } from "@/app/about/AboutRouter";
import { BrandRouter } from "@/app/brand/BrandRouter";
import { LogInRouter } from "@/app/login/LogInRouter";
import { OrderListRouter } from "@/app/order-list/OrderListRouter";
import { ShoppingCartRouter } from "@/app/shopping-cart/ShoppingCartRouter";
import { MyRouter } from "@/app/my/MyRouter";
import { MainRouter } from "@/app/main/MainRouter";

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
      <AboutRouter />
      <AdminRouter />
      <BrandRouter />
      <ShoppingCartRouter />
      <StoreRouter />
      <LogInRouter />
      <OrderListRouter />
      <UserSignUpAnimationRouter />
      <MyRouter />
    </BrowserRouter>
  );
}

export default App;
