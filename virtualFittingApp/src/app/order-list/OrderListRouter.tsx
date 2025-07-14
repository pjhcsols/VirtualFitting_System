import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { OrderListPage } from "@/pages";
import { OrderListLayout } from "@/shared";

function OrderListRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/order" element={<OrderListLayout />}>
          <Route index element={<OrderListPage />} />
          </Route>
      </Routes>
    </AnimatePresence>
  );
}


/*

function ShoppingCartRouter() {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/shopping-cart" element={<ShoppingCartLayout />}>
            <Route index element={<ShoppingCartPage />} />
            </Route>
        </Routes>
      </AnimatePresence>
    );
}


*/
export { OrderListRouter };
