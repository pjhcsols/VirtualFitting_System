import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import Cookies from "js-cookie";

export const fetchUserProfileImage = async (): Promise<string | null> => {
    const userId = Cookies.get("userId");
    if (!userId) {
        console.error("userId 쿠키 없음");
        return null;
    }

    try {
        const res = await API_BASILIUM.get("b1/users/me/profile-image", {
            params: { userId }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e) {
        console.error("프로필 이미지 불러오기 실패", e);
    }
    return null;
};

export const fetchUserImage = async (): Promise<string | null> => {
    const userId = Cookies.get("userId");
    if (!userId) {
        console.error("userId 쿠키 없음");
        return null;
    }

    try {
        const res = await API_BASILIUM.get("b1/users/me/image", {
            params: { userId }
        });
        if (res.status === 200) {
            return res.data;
        }
    } catch (e) {
        console.error("전신 이미지 불러오기 실패", e);
    }
    return null;
};
