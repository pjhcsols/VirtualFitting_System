import "./App.css";

import { BrowserRouter } from "react-router-dom";

import { StoreRouter } from "@/app/store/StoreRouter";
import { AdminRouter } from "@/app/admin/AdminRouter";
import { AboutRouter } from "@/app/about/AboutRouter";
import { BrandRouter } from "@/app/brand/BrandRouter";
import { OrderListRouter } from "@/app/order-list/OrderListRouter";
import { ShoppingCartRouter } from "@/app/shopping-cart/ShoppingCartRouter";
import { MyRouter } from "@/app/my/MyRouter";
import { MainRouter } from "@/app/main/MainRouter";
import AuthRouter from "@/app/auth/AuthRouter";

function App() {
  return (
    <BrowserRouter>
      <AuthRouter />
      <MainRouter />
      <AboutRouter />
      <AdminRouter />
      <BrandRouter />
      <ShoppingCartRouter />
      <StoreRouter />
      <OrderListRouter />
      <MyRouter />
    </BrowserRouter>
  );
}

export default App;
