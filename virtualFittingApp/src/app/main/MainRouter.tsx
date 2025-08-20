import { Route, Routes } from "react-router-dom";

import { MainPage } from "@/pages";
import { MainLayout } from "@/shared";

function MainRouter() {
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="" element={<MainLayout />}>
        <Route index element={<MainPage />} />
      </Route>
    </Routes>
  );
}

export { MainRouter };
