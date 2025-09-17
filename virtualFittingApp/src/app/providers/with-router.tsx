import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MyPage } from "@/pages/my";
import { MyOrderList } from "@/pages/my/ui/MyOrderList";
import { MyOrderListDetail } from "@/pages/my/ui/MyOrderListDetail";
import { PaymentFailPage, PaymentSuccessPage, PaymentPage } from "@/pages/payment";
import { MyCancelListPage } from "@/pages/my-cancel-list";
import { MyLikeListPage } from "@/pages/my-like-list";
import { MyReviewListPage } from "@/pages/my-review-list";
import { WriteReviewPage } from "@/pages/write-review";

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
} from "@/pages";

import { MainLayout } from "@/app/layouts/main/MainLayout";
import { AdminLayout } from "@/app/layouts/admin/AdminLayout";
import { BrandLayout } from "../layouts/brand/BrandLayout";
import { CartLayout } from "../layouts/cart/CartLayout";
import { StoreLayout } from "../layouts/store/StoreLayout";
import { MyPageLayout } from "../layouts/my/MyLayout";
import { PaymentLayout } from "../layouts/payment/PaymentLayout";
import { SignUpLayout } from "@/app/layouts/auth";
import { BrandProductLayout } from "@/app/layouts/brand/BrandProductLayout";

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
        <Route path="/cart" element={<CartLayout />}>
        <Route index element={<ShoppingCartPage />} />
        </Route>
        <Route path="store" element={<StoreLayout />}>
        <Route index element={<StorePage />} />
        <Route path=":id" element={<StoreDetailPage />} />
        </Route>
        <Route path="/payment" element={<PaymentLayout />}>
        <Route index element={<PaymentPage />} />
        <Route path="success" element={<PaymentSuccessPage />} />
        <Route path="fail" element={<PaymentFailPage />} />
        </Route>

        <Route path="/mypage" element={<MyPageLayout />}>
        <Route index element={<MyPage />} />
        <Route path="order" element={<MyOrderList />} />
        <Route path="order/:id" element={<MyOrderListDetail />} />
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
