export interface LoginData {
  userId: string;
  userPassword: string;
}

export interface LoginResponse {
  token: string;
  type: string;
}
