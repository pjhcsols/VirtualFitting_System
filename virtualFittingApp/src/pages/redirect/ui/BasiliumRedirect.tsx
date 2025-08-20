import { Navigate, useLocation } from "react-router-dom";
import { getUserRole } from "@/shared";

function BasiliumRedirect() {
  const location = useLocation();

  const getRedirectPath = () => {
    const pathname = location.pathname;

    if (pathname.startsWith("/admin")) {
      const userRole = getUserRole();
      if (userRole !== "ADMIN") {
        return "/login";
      }
    }

    // Security Problem 존재
    // 추후 변경 필요
    if (pathname.startsWith("/brand")) {
      const userRole = getUserRole();
      if (userRole !== "BRAND") {
        return "/login";
      }
    }
    return "/";
  };

  return <Navigate to={getRedirectPath()} replace />;
}

export { BasiliumRedirect };
