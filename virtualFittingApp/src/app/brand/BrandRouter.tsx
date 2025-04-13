import { Route, Routes, useLocation } from "react-router-dom";
import { BrandPage } from "@/pages";

import { AnimatePresence } from "motion/react";
import { BrandProfile } from "@/pages/brand/ui/BrandProfile";
import { BrandLayout } from "@/shared";

function BrandRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="brand" element={<BrandLayout />}>
          <Route index element={<BrandPage />} />
          <Route path="my" element={<BrandProfile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { BrandRouter };
