import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "@/shared";

import {
  AdminBannerManager,
  AdminBrandControllPanel,
  AdminTotalProduct,
} from "@/pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="user" element={<AdminBrandControllPanel />} />
        <Route path="product" element={<AdminTotalProduct />} />
        <Route path="banner" element={<AdminBannerManager />} />
      </Route>
    </Routes>
  );
}

export { AdminRouter };
