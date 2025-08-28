import { Route, Routes, useLocation } from "react-router-dom";
import {
  BasiliumRedirect,
  BrandAnalytics,
  BrandCoupon,
  BrandDashboard,
  BrandPage,
  BrandPaymentPage,
  BrandProductCreate,
  BrandProductListPage,
  BrandProfile,
} from "@/pages";

import { BrandLayout } from "@/shared";

function BrandRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="brand">
        <Route index element={<BrandPage />} />
        <Route element={<BrandLayout />}>
          <Route path="dashboard" index element={<BrandDashboard />} />
          <Route path="product">
            <Route index element={<BrandProductListPage />} />
            <Route path="create" element={<BrandProductCreate />} />
          </Route>
          <Route path="payment" element={<BrandPaymentPage />} />
          <Route path="coupon" element={<BrandCoupon />} />
          <Route path="my" element={<BrandProfile />} />
          <Route path="analytics" element={<BrandAnalytics />} />
          <Route path="*" element={<BasiliumRedirect />} />
        </Route>
      </Route>
    </Routes>
  );
}

export { BrandRouter };
