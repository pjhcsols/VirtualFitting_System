import { BrandUserType } from "@/pages/brand";
import { useEffect, useState } from "react";
import { getNotAllowedBrandUsers } from "../api/admin.action";

function useBrandUser() {
  const [brandUsers, setBrandUsers] = useState<BrandUserType[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getNotAllowedBrandUsers();
        setBrandUsers(res.data);
      } catch (err) {
        if (err instanceof CustomException) {
          setErrMsg(err.message);
        }
      }
    };
    fetchData();
  }, []);
  return {
    errMsg,
    brandUsers,
  };
}

export { useBrandUser };
