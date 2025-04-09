import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { StoreLayout } from "@/shared";
import { StoreDetailPage, StorePage } from "@/pages";

function StoreRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="store" element={<StoreLayout />}>
          <Route index element={<StorePage />} />
          <Route path=":id" element={<StoreDetailPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { StoreRouter };
