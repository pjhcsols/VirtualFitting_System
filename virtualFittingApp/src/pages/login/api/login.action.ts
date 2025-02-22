import { API_BASILIUM } from "@/shared/config/AxiosConfig";
import { LoginData, LoginResponse } from "../types/login";
import Cookies from "js-cookie";

export const loginUser = async (data: LoginData): Promise<LoginResponse> => { 
    try {
        const response = await API_BASILIUM.post<LoginResponse>("/User/login", data);

        if (response.status === 200) {
            Cookies.set("access-token", response.data.token);
            Cookies.set("user_info", JSON.stringify({
                userId: data.userId,
                loginType: response.data.type,
            }));

            return response.data;
        }

        throw new Error("Unexpected response status");
    } catch (error) {
        console.error("로그인 실패:", error);
        throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
};
