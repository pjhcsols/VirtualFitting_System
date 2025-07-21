declare global {
  interface Window {
    daum: any;
  }
}

export interface SubmitUserFormData extends Omit<UserFormData, "address"> {
  address: string;
}

export type UserFormData = {
  name: string;
  password: string;
  emailAddress: string;
  phoneNumber: string;
  nickname: string;
  birthDate: string;
  address: Address;
  // gender: "남자" | "여자" | "";
  size: BodySize;
  userProfileImageUrl?: File | string;
  userImageUrl?: File | string;
}

export type BodySize = {
  height: number;             // 신장
  weight: number;             // 체중
  totalLength: number;        // 총장
  chest: number;              // 가슴둘레
  shoulder: number;           // 어깨너비
  arm: number;                // 팔길이
  pantsTotalLength: number;   // 바지 총장
  waistWidth: number;         // 허리둘레
  hipWidth: number;           // 엉덩이둘레
  rise: number;               // 밑위길이
  hemWidth: number;           // 밑단너비
}

export interface Address {
  address: string;
  zonecode: string;
  detailAddress: string;
}