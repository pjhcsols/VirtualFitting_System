export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: T;
}