import type { ApiResponse } from "@/shared/types/api";

declare global {
  interface Window {
    daum: any;
  }
}

export type Gender = "MALE" | "FEMALE" | ""; 
export type FormGender = "M" | "F" | ""

export interface SubmitUserFormData extends Omit<UserFormData, "address"> {
  address: string;
}

export interface UserFormData {
  name: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  nickname: string;
  birthDate: string;
  address: Address;
  gender: FormGender;
  size: BodySize;
  userProfileImageUrl?: File | string;
  userImageUrl?: File | string;
}

export interface BodySize {
  height: number | null;
  weight: number | null;
  totalLength: number | null;
  chest: number | null;
  shoulder: number | null;
  arm: number | null;
  pantsTotalLength: number | null;
  waistWidth: number | null;
  hipWidth: number | null;
  thighWidth: number | null;
  rise: number | null;
  hemWidth: number | null;
}

export interface Address {
  address: string;
  zonecode: string;
  detailAddress: string;
}

export type EmailVerificationInputProps = {
  authCode: string;
  onChange: (code: string) => void;
  onVerify: () => void;
};

export interface UserDetail {
  id: string;
  emailAddress: string;
  phoneNumber: string;
  name: string;
  nickname: string;
  gender: Gender; 
  birthDate: string;
  address: Address;
  userNumber: number;
  userGrade: string;
  loginType: string; 
  userImageUrl?: string | null; 
  userProfileImageUrl?: string | null; 
  totalLength: number | null;
  chest: number | null;
  shoulder: number | null;
  arm: number | null;
  pantsTotalLength: number | null;
  waistWidth: number | null;
  hipWidth: number | null;
  thighWidth: number | null;
  rise: number | null;
  hemWidth: number | null;
  height: number | null;
  weight: number | null;
}

// DTO 스키마 맞춘다고 옵셔널 썼음
export type UpdateUserDetailRequest = {
  password?: string;
  emailAddress?: string;
  phoneNumber?: string;
  name?: string;
  nickname?: string;
  birthDate?: string;
  address?: string;
  totalLength?: number;
  chest?: number;
  shoulder?: number;
  arm?: number;
  pantsTotalLength?: number;
  waistWidth?: number;
  hipWidth?: number;
  thighWidth?: number;
  rise?: number;
  hemWidth?: number;
  height?: number;
  weight?: number;
};

export interface UpdateAddressRequest {
  name: string;
  address: string;       
  phoneNumber: string; 
}

export type UserDetailResponse = ApiResponse<UserDetail>;
