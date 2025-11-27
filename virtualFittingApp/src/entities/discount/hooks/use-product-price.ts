import { useQuery } from '@tanstack/react-query';
import { fetchDiscountQuote } from '../api/discount.api';

export const useProductPriceQuery = (
    productId: number,
    color: string,
    size: string,
    accessToken: string | null
) => {
    return useQuery<{ original: number; discounted: number } | null, Error>({
        queryKey: ['productPrice', productId, color, size, accessToken],
        queryFn: async () => {
            if (!accessToken) return null;
            const quote = await fetchDiscountQuote({ productId, userId: accessToken, color, size });
            
            if (quote) {
                return {
                    original: quote.baseUnitPrice,
                    discounted: quote.finalUnitPrice ?? quote.baseUnitPrice,
                };
            }
            return null;
        },
        enabled: !!accessToken && !!productId && !!color && !!size,
        staleTime: 60000,
    });
};