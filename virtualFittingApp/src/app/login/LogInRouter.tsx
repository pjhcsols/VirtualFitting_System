import { Route, Routes, useLocation } from "react-router-dom";

import { LogInPage } from "@/pages";
import { LogInLayout } from "@/shared";

import { AnimatePresence } from "motion/react";

function LogInRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LogInLayout />}>
          <Route index element={<LogInPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { LogInRouter };
