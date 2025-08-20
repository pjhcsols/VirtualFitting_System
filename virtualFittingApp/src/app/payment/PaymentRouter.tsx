import { Route, Routes, useLocation } from "react-router-dom";
import { CheckoutPage } from "@/pages";
import { SuccessPage, FailPage } from "@/features";
import { AnimatePresence } from "motion/react";
import { PaymentLayout } from "@/shared";

export function PaymentRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="payment" element={<PaymentLayout />}>
          <Route path="success" element={<SuccessPage />} />
          <Route path="fail" element={<FailPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
