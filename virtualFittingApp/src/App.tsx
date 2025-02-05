import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./shared/lib/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brand" element={<BrandPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Signup_User" element={<SignUpPageUser />} />
          <Route path="/Signup_Brand" element={<SignUpPageBrand />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/storeDetail/:productId" element={<StoreDetailPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/OrderListPage" element={<OrderListPage />} />
          <Route path="/ShoppingCartPage" element={<ShoppingCartPage />} />
          <Route path="/kakaoLogin" element={<KaKaoLogin />} />
          <Route path="/naverLogin" element={<NaverLogin />} />
          <Route path="/googleLogin" element={<GoogleLogin />} />
          <Route path="/searchResult" element={<SearchResultPage />} />
          <Route
            path="/productRegisteration"
            element={<ProductRegisterationPage />}
          />
          <Route path="/oauth/kakao/callback" element={<Redirection />} />
          <Route
            path="/oauth/google/callback"
            element={<GoolgeRedirection />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
