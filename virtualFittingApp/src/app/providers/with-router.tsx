import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  PaymentFailPage,
  PaymentSuccessPage,
  PaymentPage,
} from "@/pages/payment";

import { ProductDetailPage } from "@/pages/product/detail";
import { ProductListPage } from "@/pages/product/list";
import { MyDashboardPage } from "@/pages/my/dashboard";
import { MyOrderListPage } from "@/pages/my/order-list";
import { MyOrderDetailPage } from "@/pages/my/order-detail";
import { MyCancelListPage } from "@/pages/my/cancel-list";
import { MyLikeListPage } from "@/pages/my/like-list";
import { MyReviewListPage } from "@/pages/my/review-list";
import { WriteReviewPage } from "@/pages/my/write-review";
import { CartPage } from "@/pages/cart";

import {
  MainPage,
  AdminLogin,
  BrandSignUpPage,
  FailedPage,
  Loginpage,
  NormalSignUpPage,
  SuccessSignUpPage,
  AdminHome,
  AdminBanner,
  AdminBrandUsers,
  AdminUser,
  BasiliumRedirect,
  BrandPage,
} from "@/pages";

import { MainLayout } from "@/app/layouts/main/MainLayout";
import { AdminLayout } from "@/app/layouts/admin/AdminLayout";
import { CartLayout } from "../layouts/cart/CartLayout";
import { ProductLayout } from "../layouts/product/product-layout";
import { MyPageLayout } from "../layouts/my/MyLayout";
import { PaymentLayout } from "../layouts/payment/payment-layout";
import { SignUpLayout } from "@/app/layouts/auth";
import { BrandLayout } from "../layouts/brand";
import { BrandLobby } from "@/pages/brand/ui/lobby";
import { BrandProduct } from "@/pages/brand/ui/product";


const Routing = () => (
  <Routes>
    <Route path="" element={<MainLayout />}>
      <Route index element={<MainPage />} />
    </Route>
    <Route path="login">
      <Route index element={<Loginpage />} />
      <Route path="admin" element={<AdminLogin />} />
    </Route>
    <Route path="signup" element={<SignUpLayout />}>
      <Route index element={<NormalSignUpPage />} />
      <Route path="brand" element={<BrandSignUpPage />} />
      <Route path="success" element={<SuccessSignUpPage />} />
      <Route path="failed" element={<FailedPage />} />
    </Route>
    <Route path="admin" element={<AdminLayout />}>
      <Route index element={<AdminHome />} />
      <Route path="banner" element={<AdminBanner />} />
      <Route path="brand" element={<AdminBrandUsers />} />
      <Route path="user" element={<AdminUser />} />
      <Route path="*" element={<BasiliumRedirect />} />
    </Route>
    <Route path="brand">
      <Route index element={<BrandPage />} />
      <Route element={<BrandLayout />}>
        <Route path="dashboard" element={<BrandLobby />} />
        <Route path="products" element={<BrandProduct />} />
      </Route>
      <Route path="*" element={<BasiliumRedirect />} />
    </Route>
    <Route path="/cart" element={<CartLayout />}>
      <Route index element={<CartPage />} />
    </Route>
    <Route path="products" element={<ProductLayout />}>
      <Route index element={<ProductListPage />} />
      <Route path=":id" element={<ProductDetailPage />} />
    </Route>
    <Route path="/payment" element={<PaymentLayout />}>
      <Route index element={<PaymentPage />} />
      <Route path="success" element={<PaymentSuccessPage />} />
      <Route path="fail" element={<PaymentFailPage />} />
    </Route>
    <Route path="/mypage" element={<MyPageLayout />}>
      <Route index element={<MyDashboardPage />} />
      <Route path="order" element={<MyOrderListPage />} />
      <Route path="order/:id" element={<MyOrderDetailPage />} />
      <Route path="cancel" element={<MyCancelListPage />} />
      <Route path="like" element={<MyLikeListPage />} />
      <Route path="review" element={<MyReviewListPage />} />
      <Route path="review/:id" element={<WriteReviewPage />} />
    </Route>
  </Routes>
);

export const withRouter = (component: () => React.ReactNode) => () => (
  <BrowserRouter>{component()}</BrowserRouter>
);

export default Routing;