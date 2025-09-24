export interface Banner {
  userNumber: number;
  fileName: string;
  url: string;
}

export interface GetBannersResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: Banner[];
}