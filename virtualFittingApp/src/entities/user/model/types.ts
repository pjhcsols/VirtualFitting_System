declare global {
  interface Window {
    daum: any;
  }
}

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
  // gender: "M" | "F" | "";
  size: BodySize;
  userProfileImageUrl?: File | string;
  userImageUrl?: File | string;
}

export interface BodySize {
  height: number;
  weight: number;
  totalLength: number;
  chest: number;
  shoulder: number;
  arm: number;
  pantsTotalLength: number;
  waistWidth: number;
  hipWidth: number;
  rise: number;
  hemWidth: number;
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
