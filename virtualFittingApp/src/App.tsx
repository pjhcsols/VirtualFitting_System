import "./App.css";
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MyPage } from "@/pages/my";
import { MyOrderList } from "@/pages/my/ui/MyOrderList";
import { MyCancel } from "@/pages/my/ui/MyCancel";
import { MyLike } from "@/pages/my/ui/MyLike";
import { MyOrderListDetail } from "@/pages/my/ui/MyOrderListDetail";
import { MyReview } from "@/pages/my";
import { StyleReview } from "@/pages/my";
import { PaymentFailPage, PaymentSuccessPage } from "@/features";
import {
  MainPage,
  AdminLogin,
  AboutPage,
  BrandSignUpPage,
  FailedPage,
  Loginpage,
  NormalSignUpPage,
  SuccessSignUpPage,
  AdminHome,
  AdminBanner,
  AdminBrand,
  AdminProduct,
  AdminUser,
  BasiliumRedirect,
  BrandAnalytics,
  BrandCoupon,
  BrandDashboard,
  BrandPage,
  BrandPaymentPage,
  BrandProductCreate,
  BrandProductListPage,
  BrandProfile,
  ShoppingCartPage,
  StoreDetailPage,
  StorePage,
  OrderListPage,
} from "@/pages";
import {
  MainLayout,
  AdminLayout,
  BrandLayout,
  ShoppingCartLayout,
  StoreLayout,
  OrderListLayout,
  MyPageLayout,
  PaymentLayout,
} from "@/shared";
import { SignUpLayout } from "@/shared/layout/auth";
import { BrandProductLayout } from "@/shared/layout/brand/BrandProductLayout";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<MainLayout />}>
            <Route index element={<MainPage />} />
          </Route>
          <Route path="/about" element={<AboutPage />} />
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
            <Route path="brand" element={<AdminBrand />} />
            <Route path="user" element={<AdminUser />} />
            <Route path="product" element={<AdminProduct />} />
            <Route path="*" element={<BasiliumRedirect />} />
          </Route>
          <Route path="brand">
            <Route index element={<BrandPage />} />
            <Route element={<BrandLayout />}>
              <Route path="dashboard" index element={<BrandDashboard />} />
              <Route path="product" element={<BrandProductLayout />}>
                <Route path="list" index element={<BrandProductListPage />} />
                <Route path="create" element={<BrandProductCreate />} />
                <Route path="coupon" element={<BrandCoupon />} />
              </Route>
              <Route path="payment" element={<BrandPaymentPage />} />
              <Route path="my" element={<BrandProfile />} />
              <Route path="analytics" element={<BrandAnalytics />} />
              <Route path="*" element={<BasiliumRedirect />} />
            </Route>
          </Route>
          <Route path="/cart" element={<ShoppingCartLayout />}>
            <Route index element={<ShoppingCartPage />} />
          </Route>
          <Route path="store" element={<StoreLayout />}>
            <Route index element={<StorePage />} />
            <Route path=":id" element={<StoreDetailPage />} />
          </Route>
          <Route path="/payment" element={<PaymentLayout />}>
            <Route path="success" element={<PaymentSuccessPage />} />
            <Route path="fail" element={<PaymentFailPage />} />
          </Route>
          <Route path="/order" element={<OrderListLayout />}>
            <Route index element={<OrderListPage />} />
          </Route>
          <Route path="/mypage" element={<MyPageLayout />}>
            <Route index element={<MyPage />} /> {/* /mypage */}
            <Route path="order" element={<MyOrderList />} /> {/* /mypage/order */}
            <Route path="order/:id" element={<MyOrderListDetail />} />
            <Route path="cancel" element={<MyCancel />} />
            <Route path="like" element={<MyLike />} />
            <Route path="review" element={<MyReview />} />
            <Route path="review/:id" element={<StyleReview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
