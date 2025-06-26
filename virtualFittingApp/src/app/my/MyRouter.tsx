import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { MyPage } from "@/pages/my";
import { MypageDetail } from "@/pages/my";
import { MyOrderList } from "@/pages/my/ui/MyOrderList";
import { MyCancel } from "@/pages/my/ui/MyCancel";
import { MyLike } from "@/pages/my/ui/MyLike";
import { MyOrderListDetail } from "@/pages/my/ui/MyOrderListDetail";
import { MyReview } from "@/pages/my";
import { StyleReview } from "@/pages/my";

function MyRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myPage/detail" element={<MypageDetail />} />
        <Route path="/myPage/order" element={<MyOrderList />} />
        <Route path="/myPage/order/:id" element={<MyOrderListDetail />} />
        <Route path="/myPage/cancel" element={<MyCancel />} />
        <Route path="/myPage/like" element={<MyLike />} />
        <Route path="/myPage/review" element={<MyReview />} />
        <Route path="/myPage/review/:id" element={<StyleReview />} />
      </Routes>
    </AnimatePresence>
  );
}

export { MyRouter };
