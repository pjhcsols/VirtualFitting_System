import { apiClient } from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/types/api";
import type { AxiosRequestConfig } from "axios";
import type { TryOnResponseData, TryOnQueryParams, PublicTryOnQueryParams } from "../model/types"; 


export const tryOnPrivateFitting = async (
  params: TryOnQueryParams,
  file: File | Blob
): Promise<ApiResponse<TryOnResponseData> | null> => {

  const formData = new FormData();
  formData.append('file', file); 
  const config: AxiosRequestConfig = {
    method: 'post',

    url: "/b1/virtual-fitting/try-on", 
    params: params, 
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data', 
    }
  };

  try {
    const response = await apiClient<TryOnResponseData>(config);
    return response as unknown as ApiResponse<TryOnResponseData>;

  } catch (error) {
    return null; 
  }
};

export const tryOnPublicFitting = async (
  params: PublicTryOnQueryParams,
  file: File | Blob
): Promise<ApiResponse<TryOnResponseData> | null> => {

  if (params.productId !== 1) {
      return null; 
  }

  const requiredFileName = `base_${params.gender.toLowerCase()}.png`;
  const formData = new FormData();
  formData.append('file', file, requiredFileName); 

  const config: AxiosRequestConfig = {
    method: 'post',
    url: "/b1/virtual-fitting/try-on/public", 
    params: params, 
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data', 
    }
  };

try {

    const response = await apiClient<TryOnResponseData>(config); 
    return response;
  } catch (error) {
    return null;
  }
};