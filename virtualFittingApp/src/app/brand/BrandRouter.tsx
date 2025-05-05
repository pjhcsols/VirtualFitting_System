import { Route, Routes, useLocation } from "react-router-dom";
import {
  BrandDashboard,
  BrandPage,
  BrandProductCreate,
  BrandProductList,
  BrandProfile,
} from "@/pages";

import { AnimatePresence } from "motion/react";
import { BrandLayout } from "@/shared";

function BrandRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="brand" element={<BrandPage />} />
        <Route path="brand" element={<BrandLayout />}>
          <Route path="dashboard" index element={<BrandDashboard />} />
          <Route path="list" element={<BrandProductList />} />
          <Route path="create" element={<BrandProductCreate />} />
          <Route path="my" element={<BrandProfile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { BrandRouter };
