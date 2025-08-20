import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "@/shared";

import {
  AdminHome,
  AdminBanner,
  AdminBrand,
  BasiliumRedirect,
  AdminProduct,
  AdminUser,
} from "@/pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="banner" element={<AdminBanner />} />
        <Route path="brand" element={<AdminBrand />} />
        <Route path="user" element={<AdminUser />} />
        <Route path="product" element={<AdminProduct />} />
        <Route path="*" element={<BasiliumRedirect />} />
      </Route>
    </Routes>
  );
}

export { AdminRouter };
