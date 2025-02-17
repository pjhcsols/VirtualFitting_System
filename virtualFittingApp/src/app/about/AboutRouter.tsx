import { AnimatePresence } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AboutPage } from "../../pages";

function AboutRouter() {
  const location = useLocation();
  return (
      <Routes location={location} key={location.pathname}>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
  );
}

export { AboutRouter };
