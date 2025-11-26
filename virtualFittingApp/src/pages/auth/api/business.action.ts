import axios from "axios";

const SERVICE_KEY = import.meta.env
  .VITE_APPLICATION_BUSINESS_REGISTRATION_API_KEY as string;

type BusinessType = {
  b_no: string[];
};

export const validateBusiness = async (key: string) => {
  const request: BusinessType = {
    b_no: [key],
  };
  try {
    const res = await axios.post(
      `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${SERVICE_KEY}`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (res.status === 200) {
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};
