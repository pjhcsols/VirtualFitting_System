import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { UserFormData } from "@/entities/user/model/types";
import Cookies from "js-cookie";

export const submitUserInfo = async (
  formData: UserFormData,
) => {
  const userId = Cookies.get("userId") as string;

  const birthDateISO = new Date(formData.birthDate).toISOString();

  const requestBody = {
    userId,
    info: {
      name: formData.name,
      emailAddress: formData.emailAddress,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      nickname: formData.nickname,
      birthDate: birthDateISO,
      address: `${formData.address.zonecode}/${formData.address.address}/${formData.address.detailAddress}`.trim(),

      totalLength: formData.size.totalLength,
      chest: formData.size.chest,
      shoulder: formData.size.shoulder,
      arm: formData.size.arm,
      pantsTotalLength: formData.size.pantsTotalLength,
      waistWidth: formData.size.waistWidth,
      hipWidth: formData.size.hipWidth,
      rise: formData.size.rise,
      hemWidth: formData.size.hemWidth,
      height: formData.size.height,
      weight: formData.size.weight,
      thighWidth: 0
    }
  };
  console.log(requestBody);

  const response = await API_BASILIUM.patch("/normalUser/modify", requestBody, {
    headers: {
      "Content-Type": "application/json"
    }
  }); 

  if (response.status === 200) {
    return response.data;
  }
  
};  