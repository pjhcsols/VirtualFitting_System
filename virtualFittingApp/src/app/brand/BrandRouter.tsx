import { Route, Routes, useLocation } from "react-router-dom";
import { BrandPage } from "@/pages";

import { AnimatePresence } from "motion/react";

function BrandRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/brand" element={<BrandPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export { BrandRouter };
