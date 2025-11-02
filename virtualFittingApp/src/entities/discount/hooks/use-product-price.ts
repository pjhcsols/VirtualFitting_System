import { useQuery } from '@tanstack/react-query';
import { fetchDiscountQuote } from '../api/discount.api';

export const useProductPriceQuery = (productId: number, accessToken: string | null) => {
    return useQuery<{ original: number; discounted: number } | null, Error>({
        queryKey: ['productPrice', productId, accessToken],
        queryFn: async () => {
            if (!accessToken) return null;
            const quote = await fetchDiscountQuote({ productId, userId: accessToken });
            
            if (quote?.data) {
                return {
                    original: quote.data.baseUnitPrice,
                    discounted: quote.data.finalUnitPrice ?? quote.data.baseUnitPrice,
                };
            }
            return null;
        },
        enabled: !!accessToken && !!productId,
        staleTime: 60000,
    });
};