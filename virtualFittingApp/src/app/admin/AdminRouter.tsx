import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLayout } from "@/shared";

import { AnimatePresence } from "motion/react";
import { AdminBrandControllPanel, AdminLogin } from "@/pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminLogin />}></Route>
          <Route path=":id" element={<AdminBrandControllPanel />}></Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { AdminRouter };
