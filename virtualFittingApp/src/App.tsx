import "./App.css";

import { BrowserRouter } from "react-router-dom";
import { UserSignUpAnimationRouter } from "./app/signup/UserSignUpAnimationRouter";
import { StoreRouter } from "./app/store/StoreRouter";
import { AdminRouter } from "./app/admin/AdminRouter";

function App() {
  return (
    <BrowserRouter>
      <AdminRouter />
      <StoreRouter />
      <UserSignUpAnimationRouter />
    </BrowserRouter>
  );
}

export default App;
