import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "@/shared";

import {
  AdminBrandControllPanel,
  AdminLogin,
  AdminTotalUserList,
} from "@/pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="login/admin" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route path="branduser" element={<AdminBrandControllPanel />} />
        <Route path="all" element={<AdminTotalUserList />} />
      </Route>
    </Routes>
  );
}

export { AdminRouter };
