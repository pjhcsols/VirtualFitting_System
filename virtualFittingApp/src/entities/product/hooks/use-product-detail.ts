import { useQuery } from '@tanstack/react-query';
import { fetchProductDetailByColor } from '../api/product.api';
import type { ProductDetail } from '../model/types'; 

export const useProductDetailQuery = (productId: number | null, color : string | null) => {
  const queryKey = ['productDetail', productId, color || 'base'];
  
  return useQuery<ProductDetail | null, Error>({ 
    queryKey: queryKey,
    
    queryFn: () => {
        if (productId === null) {
            throw new Error("Product ID is required for fetching details.");
        }
        return fetchProductDetailByColor(productId, color || ''); 
    },
    enabled: !!productId, 
    staleTime: 5 * 60 * 1000,
  });
};