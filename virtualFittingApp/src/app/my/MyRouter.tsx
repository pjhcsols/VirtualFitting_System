// src/app/MyRouter.tsx (혹은 기존 파일)
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { MyPage } from "@/pages/my";
import { MyOrderList } from "@/pages/my/ui/MyOrderList";
import { MyCancel } from "@/pages/my/ui/MyCancel";
import { MyLike } from "@/pages/my/ui/MyLike";
import { MyOrderListDetail } from "@/pages/my/ui/MyOrderListDetail";
import { MyReview } from "@/pages/my";
import { StyleReview } from "@/pages/my";
import { MyPageLayout } from "@/shared";

function MyRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/mypage" element={<MyPageLayout />}>
          <Route index element={<MyPage />} />                 {/* /mypage */}
          <Route path="order" element={<MyOrderList />} />     {/* /mypage/order */}
          <Route path="order/:id" element={<MyOrderListDetail />} />
          <Route path="cancel" element={<MyCancel />} />
          <Route path="like" element={<MyLike />} />
          <Route path="review" element={<MyReview />} />
          <Route path="review/:id" element={<StyleReview />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export { MyRouter };
