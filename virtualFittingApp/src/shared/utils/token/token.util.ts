import Cookies from "js-cookie";
import { jwtDecode} from "jwt-decode";
import type { BasiliumJwtPayload } from "@/shared";

export const getUserIdFromToken = (): string | null => {
  const token = Cookies.get("access-token");
  if (!token) return null;

  const decoded = jwtDecode<BasiliumJwtPayload>(token);
  return decoded.sub;
};