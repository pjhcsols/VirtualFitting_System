import { Route, Routes, useLocation } from "react-router-dom";
import { UserSignLayout } from "../../shared";
import { AnimatePresence } from "motion/react";
import { UserSignUpDetailPage, UserSignUpPage } from "../../pages";

function UserSignUpAnimationRouter() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="signup" element={<UserSignLayout />}>
          <Route index element={<UserSignUpPage />} />
          <Route path=":id" element={<UserSignUpDetailPage />}></Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { UserSignUpAnimationRouter };
