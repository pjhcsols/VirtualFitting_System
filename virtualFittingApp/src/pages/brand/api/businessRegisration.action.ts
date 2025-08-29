import axios, { AxiosResponse } from "axios";

const API_KEY = import.meta.env
  .VITE_APPLICATION_BUSINESS_REGISTRATION_API_KEY as string;

interface IBusinessRegistration {
  b_no: string[];
}

interface IBusinessRegistrationResponse extends AxiosResponse {
  match_cnt: number;
}

export const isValidBrandRegistration = async (registration: string) => {
  try {
    // g 옵션이 global 옵션으로 String 에 있는 - 를 전부 없애줌.
    const request: IBusinessRegistration = {
      b_no: [registration.replace(/-/g, "")],
    };
    const res = await axios.post<IBusinessRegistrationResponse>(
      `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${API_KEY}`,
      request,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (res.status === 200) {
      console.log(res.data);
      return res.data.match_cnt === 1;
    }
  } catch (err) {
    console.error(err);
  }
};
