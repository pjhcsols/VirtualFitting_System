export interface UserFormData {
  id: string;
  name: string;
  email: string;
  phoneNumber: number;
  birthdate: string;
  gender: string;
  size: BodySize;
  photoUrl: string;
}

export interface BodySize {
  height: number;
  weight: number;
  length: number;
  shoulder: mumber;
}