import { Route, Routes, useLocation } from "react-router-dom";
import { CheckoutPage } from "@/pages";
import { SuccessPage } from "@/features";
import { AnimatePresence } from "motion/react";

export function PaymentRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/payment/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<SuccessPage />} />
      </Routes>
    </AnimatePresence>
  );
}
