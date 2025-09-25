import { useState } from "react";
import * as S from "./style";

interface IMessageModal {
  message: string;
  isError: boolean;
}

function MessageModal({ message, isError }: IMessageModal) {
  const [isVisible, setIsVisble] = useState<boolean>(true);
  const onClickCheck = () => {
    setIsVisble(false);
  };
  return (
    <S.AlarmContainer visible={isVisible}>
      <S.Text error={isError}>{message}</S.Text>
      <S.Button onClick={onClickCheck}>확인</S.Button>
    </S.AlarmContainer>
  );
}

export { MessageModal };
