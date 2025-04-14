import { AnimatePresence } from "framer-motion"
import { Route, Routes, useLocation } from "react-router-dom";
import { MyPage } from "@/pages/my";
import { MypageDetail } from "@/pages/my";
import { MyOrderList } from "@/pages/my/ui/MyOrderList";
import { MyCancel } from "@/pages/my/ui/MyCancel";
import { MyLike } from "@/pages/my/ui/MyLike";

function MyRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myPage/detail" element={<MypageDetail />} />
        <Route path="/myPage/order" element={<MyOrderList />} />
        <Route path="/myPage/cancel" element={<MyCancel />} />
        <Route path="/myPage/like" element={<MyLike />} />
      </Routes>
    </AnimatePresence>
  );
}

export { MyRouter };
