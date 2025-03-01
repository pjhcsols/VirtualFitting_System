import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ShoppingCartPage } from "../../pages";

function ShoppingCartRouter() {
    const location = useLocation();
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/shopping-cart" element={<ShoppingCartPage />} />
        </Routes>
      </AnimatePresence>
    );
}

export { ShoppingCartRouter };