import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAddress } from '@/entities/user';
import type { UserDetailResponse, UpdateAddressRequest } from '@/entities/user'; 

interface UpdateAddressVariables {
  userId: string;
  addressData: UpdateAddressRequest;
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation<UserDetailResponse | null, Error, UpdateAddressVariables>({
    mutationFn: ({ userId, addressData }) => {
      return updateAddress(userId, addressData);
    },
    
    onSuccess: (updatedUserDetail) => {
      if (updatedUserDetail) {
        queryClient.invalidateQueries({ queryKey: ['userDetails', 'me'] });
        queryClient.invalidateQueries({ queryKey: ['userInfo'] }); 

        console.log("주소 변경 성공. 캐시 무효화 완료.");
      }
    },
    onError: (error) => {
      console.error("주소 변경 요청 실패:", error);
      alert("주소 변경에 실패했습니다. 유효한 주소인지 확인해 주세요.");
    },
  });
};