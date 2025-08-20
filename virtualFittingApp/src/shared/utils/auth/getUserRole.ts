import { jwtDecode, type JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";

interface BasiliumJwtPayload extends JwtPayload {
  role: string;
}

export const getUserRole = () => {
  const token = Cookies.get("accessToken");
  if (token) {
    const decodedToken = jwtDecode<BasiliumJwtPayload>(token);
    return decodedToken.role;
  }
  return null;
};
