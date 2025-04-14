import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import { UserFormData } from "../types/user";

export const submitUserInfo = async (
  formData: UserFormData,
  profileFile?: File,
  photoFile?: File
) => {
  const genderValue = formData.gender === "남자" ? 0 : 1;

  const data = new FormData();

  data.append("id", formData.id);
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("phoneNumber", formData.phoneNumber);
  data.append("birthdate", formData.birthdate);
  data.append("gender", genderValue.toString());

  data.append("size[height]", formData.size.height.toString());
  data.append("size[weight]", formData.size.weight.toString());
  data.append("size[length]", formData.size.length.toString());
  data.append("size[shoulder]", formData.size.shoulder.toString());

  // 파일 첨부
  if (profileFile) {
    data.append("profilePhoto", profileFile); 
  }

  if (photoFile) {
    data.append("photo", photoFile);
  }

  const response = await API_BASILIUM.post("/api/user/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
