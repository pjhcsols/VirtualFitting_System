import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { OrderListPage } from "../../pages";

function OrderListRouter() {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/order" element={<OrderListPage />} />
        </Routes>
      </AnimatePresence>
    );
}

export { OrderListRouter };