import { Route, Routes, useLocation } from "react-router-dom";
import {
  AdminLogin,
  BrandSignUpPage,
  FailedPage,
  Loginpage,
  NormalSignUpPage,
  SuccessSignUpPage,
} from "@/pages";
import { LoginLayout } from "@/shared";
import { SignUpLayout } from "@/shared/layout/auth";

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="login" element={<LoginLayout />}>
        <Route index element={<Loginpage />} />
        <Route path="admin" element={<AdminLogin />} />
      </Route>
      <Route path="signup" element={<SignUpLayout />}>
        <Route index element={<NormalSignUpPage />} />
        <Route path="brand" element={<BrandSignUpPage />} />
        <Route path="success" element={<SuccessSignUpPage />} />
        <Route path="failed" element={<FailedPage />} />
      </Route>
    </Routes>
  );
}
