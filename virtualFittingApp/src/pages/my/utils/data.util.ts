import { useState, useEffect } from "react";
import { fetchUserData } from "../api/user.action"; // API 함수 가져오기
import { UserData } from "../types/use";

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const jwtToken = localStorage.getItem("login-token");
        const config = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        };

        const data = await fetchUserData(config);
        setUserData(data);
      } catch (error) {
        console.error("사용자 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchUser();
  }, []);

  return { userData };
};

export default useUserData;
