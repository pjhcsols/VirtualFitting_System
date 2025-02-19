import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { LogInPage } from "../../pages";

function LogInRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LogInPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export { LogInRouter };
