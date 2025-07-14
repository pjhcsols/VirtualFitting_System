import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import type { UserFormData } from "../types/user";
import { formatDate } from "@/shared";

export const submitUserInfo = async (
  formData: UserFormData,
  profileFile?: File,
  photoFile?: File
) => {
  // const genderValue = formData.gender === "남자" ? 0 : 1;

  const data = new FormData();

  data.append("nickname", formData.nickname);
  data.append("password", formData.password);
  data.append("name", formData.name);
  data.append("email", formData.emailAddress);
  data.append("phoneNumber", formData.phoneNumber);
  data.append("birthdate", formData.birthDate);
  data.append("address", `${formData.address.address} ${formData.address.detailAddress}`.trim());
  // data.append("zonecode", formData.address.zonecode);

  // data.append("gender", genderValue.toString());

  data.append("height", formData.size.height.toString());           
  data.append("weight", formData.size.weight.toString());           
  data.append("totalLength", formData.size.totalLength.toString()); 
  data.append("chest", formData.size.chest.toString());             
  data.append("shoulder", formData.size.shoulder.toString());       
  data.append("arm", formData.size.arm.toString());                 
  data.append("pantsTotalLength", formData.size.pantsTotalLength.toString()); 
  data.append("waistWidth", formData.size.waistWidth.toString());   
  data.append("hipWidth", formData.size.hipWidth.toString());       
  data.append("rise", formData.size.rise.toString());               
  data.append("hemWidth", formData.size.hemWidth.toString());

  // 파일 첨부
  if (profileFile) {
    data.append("userProfileImageUrl", profileFile); 
  }

  if (photoFile) {
    console.log("폼데이터에 사진 추가됨:", photoFile.name);
    data.append("userImageUrl", photoFile);
  } else {
    console.log("pundefined");
  }

  for (let [key, value] of data.entries()) {
    console.log("폼데이터:", key, value);
  }

  const response = await API_BASILIUM.patch("/normalUser/modify", data, {
    headers: {
        'Content-Type': 'multipart/form-data'
      }
  });

  return response.data;
};  