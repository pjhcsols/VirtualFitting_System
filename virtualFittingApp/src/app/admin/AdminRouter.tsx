import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "@/shared";

import {
  AdminBannerManager,
  AdminBrandControllPanel,
  AdminTotalUserList,
  AdminTotalProduct,
} from "@/pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="branduser" element={<AdminBrandControllPanel />} />
        <Route path="all" element={<AdminTotalUserList />} />
        <Route path="product" element={<AdminTotalProduct />} />
        <Route path="banner" element={<AdminBannerManager />} />
      </Route>
    </Routes>
  );
}

export { AdminRouter };
