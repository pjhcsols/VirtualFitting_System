import { Route, Routes, useLocation } from "react-router-dom";
import {
  AdminLogin,
  BrandSignUpPage,
  Loginpage,
  NormalSignUpPage,
  SignupPage,
} from "@/pages";
import { LoginLayout } from "@/shared";

export default function AuthRouter() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path="login" element={<LoginLayout />}>
        <Route index element={<Loginpage />} />
        <Route path="admin" element={<AdminLogin />} />
      </Route>
      <Route path="signup">
        <Route index element={<SignupPage />} />
        <Route path="normal" element={<NormalSignUpPage />} />
        <Route path="brand" element={<BrandSignUpPage />} />
      </Route>
    </Routes>
  );
}
