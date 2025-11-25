import { createBrowserRouter, RouteObject, Outlet } from "react-router-dom";
import { ScrollToTop } from "@/shared/lib/ui/ScrollToTop";

import {
  PaymentFailPage,
  PaymentSuccessPage,
  PaymentPage,
} from "@/pages/payment";

import { ProductDetailPage } from "@/pages/product/detail";
import { ProductListPage } from "@/pages/product/list";
import { MyDashboardPage } from "@/pages/my/dashboard";
import { MyOrderListPage } from "@/pages/my/order-list";
import {
  MyOrderDetailPage,
  OrderConfirmationPage,
} from "@/pages/my/order-detail";
import { MyCancelListPage } from "@/pages/my/cancel-list";
import { MyLikeListPage } from "@/pages/my/like-list";
import { MyReviewListPage } from "@/pages/my/review-list";
import { WriteReviewPage } from "@/pages/my/write-review";
import { CartPage } from "@/pages/cart";
import { TermsPage } from "@/pages/terms";
import { PrivacyPage } from "@/pages/privacy";
import { MypageDetail } from "@/pages/my/ui/MyPageDetail";

import {
  MainPage,
  AdminUser,
  BasiliumRedirect,
  BrandPage,
  LoginPage,
  AdminLogin,
  SuccessSignUpPage,
  FailedPage,
  AdminHome,
  AdminBanner,
  BrandSignUp,
  AdminBrandUsers,
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

import { AboutPage } from "@/pages/about";
import { SasSPage } from "@/pages/saas/ui/SaaSPage";
import { ServicePage } from "@/pages/service";
import { SignUpSelectPage } from "@/pages/auth/ui/select";
import { UserInfoForm } from "@/pages/auth/ui/normal";

const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <MainPage />,
          },
        ],
      },
      {
        path: "about",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <AboutPage />,
          },
        ],
      },
      {
        path: "saas",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <SasSPage />,
          },
        ],
      },
      {
        path: "service",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <ServicePage />,
          },
        ],
      },
      {
        path: "login",
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
          {
            path: "admin",
            element: <AdminLogin />,
          },
        ],
      },
      {
        path: "signup",
        element: <SignUpLayout />,
        children: [
          {
            index: true,
            element: <SignUpSelectPage />,
          },
          {
            path: "normal",
            element: <UserInfoForm />,
          },
          {
            path: "brand",
            element: <BrandSignUp />,
          },
          {
            path: "success",
            element: <SuccessSignUpPage />,
          },
          {
            path: "failed",
            element: <FailedPage />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminHome />,
          },
          {
            path: "banner",
            element: <AdminBanner />,
          },
          {
            path: "brand",
            element: <AdminBrandUsers />,
          },
          {
            path: "user",
            element: <AdminUser />,
          },
          {
            path: "*",
            element: <BasiliumRedirect />,
          },
        ],
      },
      {
        path: "brand",
        children: [
          {
            index: true,
            element: <BrandPage />,
          },
          {
            element: <BrandLayout />,
            children: [
              {
                path: "dashboard",
                element: <BrandLobby />,
              },
              {
                path: "products",
                element: <BrandProduct />,
              },
            ],
          },
          {
            path: "*",
            element: <BasiliumRedirect />,
          },
        ],
      },
      {
        path: "/cart",
        element: <CartLayout />,
        children: [
          {
            index: true,
            element: <CartPage />,
          },
        ],
      },
      {
        path: "products",
        element: <ProductLayout />,
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
          },
        ],
      },
      {
        path: "/payment",
        element: <PaymentLayout />,
        children: [
          {
            index: true,
            element: <PaymentPage />,
          },
          {
            path: "success",
            element: <PaymentSuccessPage />,
          },
          {
            path: "fail",
            element: <PaymentFailPage />,
          },
        ],
      },
      {
        path: "/mypage",
        element: <MyPageLayout />,
        children: [
          {
            index: true,
            element: <MyDashboardPage />,
          },
          {
            path: "detail",
            element: <MypageDetail />,
          },
          {
            path: "order",
            element: <MyOrderListPage />,
          },
          {
            path: "order/confirmation",
            element: <OrderConfirmationPage />,
          },
          {
            path: "order/:id",
            element: <MyOrderDetailPage />,
          },
          {
            path: "cancel",
            element: <MyCancelListPage />,
          },
          {
            path: "review",
            element: <MyReviewListPage />,
          },
          {
            path: "review/:id",
            element: <WriteReviewPage />,
          },
        ],
      },
      {
        path: "/like",
        element: <MyPageLayout />,
        children: [
          {
            index: true,
            element: <MyLikeListPage />,
          },
        ],
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
