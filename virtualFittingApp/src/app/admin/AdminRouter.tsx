import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AdminLayout } from "../../shared";
import {
  AdminCreateProductPage,
  AdminProductListPage,
  AdminProductPage,
} from "../../pages";

function AdminRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminProductListPage />}></Route>
          <Route path="create" element={<AdminCreateProductPage />}></Route>
          <Route path=":id" element={<AdminProductPage />}></Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { AdminRouter };
