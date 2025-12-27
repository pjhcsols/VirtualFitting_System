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
      
    onSuccess: async (updatedUserDetail) => {
      if (updatedUserDetail) {
        await queryClient.invalidateQueries({ queryKey: ['userDetails', 'me'], exact: false });
        await queryClient.invalidateQueries({ queryKey: ['userInfo'], exact: false }); 

        console.log("주소 변경 성공. 캐시 무효화 및 리페치 완료.");
        alert("배송 정보가 수정되었습니다.")
      }
    },
    onError: (error) => {
      console.error("주소 변경 요청 실패:", error);
      alert("주소 변경에 실패했습니다. 유효한 주소인지 확인해 주세요.");
    },
  });
};