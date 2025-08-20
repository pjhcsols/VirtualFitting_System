import { API_BASILIUM, BasiliumResponse } from "@/shared";
import { isAxiosError } from "axios";

interface BrandApplicants extends BasiliumResponse {
  data: BrandApplicantsDataType[];
}

type BrandApplicantsDataType = {
  userNumber: number;
  id: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  userGrade: "BRONZE";
  loginType: "NORMAL";
  userImageUrl: string;
  userProfileImageUrl: string;
  firmName: string;
  firmAddress: string;
  businessRegistration: string;
  businessRegistrationCertificateImageUrl: string;
  firmWebUrl: string;
  firmEmail: string;
  firmPhone: string;
  saleAllowed: boolean;
};

export const GET_BRAND_APPLICANTS = async () => {
  try {
    const res = await API_BASILIUM.get<BrandApplicants>("/b1/brandUsers/all");
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
  }
};

export const PATCH_BRAND_APPLICANTS_STATE = async ({
  userId,
  saleAllowed,
}: {
  userId: number;
  saleAllowed: boolean;
}) => {
  try {
    const res = await API_BASILIUM.patch(
      `/b1/brandUsers/${userId}/permissions?saleAllowed=${saleAllowed}`,
    );
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    if (!isAxiosError(err)) {
      return err;
    }
  }
};
