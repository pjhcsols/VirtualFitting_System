import { AnimatePresence } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom";
import { MyPage } from "@/pages/my";
import { MyPageDetail } from "@/pages/my";

function MyRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MyPage />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myPage/detail" element={<MyPageDetail />} />
      </Routes>
    </AnimatePresence>
  );
}

export { MyRouter };
