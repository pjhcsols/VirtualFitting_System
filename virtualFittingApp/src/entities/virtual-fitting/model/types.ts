export interface TryOnResponseData {
  resultImageUrl: string;
  simulatedDelayMillis: number;
}

export interface TryOnQueryParams {
  authUserId: string;
  productId: number;
  color: string;
  gender: 'M' | 'W';
}

export interface TryOnFullResponse {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  data: TryOnResponseData;
}

export type PublicTryOnQueryParams = Omit<TryOnQueryParams, 'authUserId'>;