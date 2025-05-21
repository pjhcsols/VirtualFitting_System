import { Route, Routes, useLocation } from "react-router-dom";

import { AdminLogin, BrandLogin, LogInPage } from "@/pages";
import { LogInLayout } from "@/shared";

import { AnimatePresence } from "motion/react";

function LogInRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="login" element={<LogInLayout />}>
          <Route index element={<LogInPage />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="brand" element={<BrandLogin />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { LogInRouter };
