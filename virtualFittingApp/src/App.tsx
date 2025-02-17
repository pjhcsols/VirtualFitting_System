import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { UserSignUpAnimationRouter } from "./app/signup/UserSignUpAnimationRouter";
import { StoreRouter } from "./app/store/StoreRouter";
import { AdminRouter } from "./app/admin/AdminRouter";
import { AboutRouter } from "./app/about/AboutRouter";
import { BrandRouter } from "./app/brand/BrandRouter";

function App() {
  return (
    <BrowserRouter>
      <AboutRouter />
      <AdminRouter />
      <BrandRouter />
      <StoreRouter />
      <UserSignUpAnimationRouter />
    </BrowserRouter>
  );
}

export default App;
