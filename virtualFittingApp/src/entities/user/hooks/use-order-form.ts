import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyUserDetails } from '@/entities/user/api/user.api';
import type { UserDetailResponse, UserDetail } from '@/entities/user/model/types';
import { Cookies } from 'react-cookie';

const cookiesInstance = new Cookies();
const userKeys = {
    me: (accessToken: string) => ['userDetails', 'me', accessToken] as const,
};

export const useOrderForm = () => {
    const accessToken = cookiesInstance.get('access-token');

    const { 
        data: responseData, 
        isLoading, 
        refetch
    } = useQuery<UserDetailResponse | null, Error>({
        queryKey: userKeys.me(accessToken!),
        queryFn: fetchMyUserDetails,
        enabled: !!accessToken,
    });

    const userDetail: UserDetail | null = useMemo(() => {
        if (responseData && responseData.data) {
            const detail = { ...responseData.data };

            if (typeof detail.address === 'string') {
                detail.address = {
                    address: detail.address,
                    detailAddress: ' ',
                    zonecode: '',
                };
            }
            return detail as UserDetail; 
        }
        return null;
    }, [responseData]);
    
    const handleSaveAddress = () => {
        refetch(); 
    };

    return { user: userDetail, isLoading, handleSaveAddress };
};
