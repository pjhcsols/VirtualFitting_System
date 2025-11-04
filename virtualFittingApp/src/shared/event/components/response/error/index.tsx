import { useCallback, useEffect, useState } from "react";
import * as S from "./style";
import { globalEventBus } from "@/shared/event/types/event.d";

export type TErrorResponse = {
  message: string;
};

function ErrorResponseModal() {
  const API_ERROR: string = "api-error";

  const [errInfo, setErrInfo] = useState<TErrorResponse | null>(null);

  const onHandleError = useCallback((data: TErrorResponse) => {
    setErrInfo(data);
  }, []);

  useEffect(() => {
    globalEventBus.on<TErrorResponse>(API_ERROR, onHandleError);
    return () => {
      globalEventBus.off(API_ERROR, onHandleError);
    };
  }, [onHandleError]);

  if (errInfo == null) {
    return null;
  }

  return (
    <S.Wrapper>
      <span>{errInfo.message}</span>
      <S.CheckButton onClick={() => setErrInfo(null)}>
        <span>확인</span>
      </S.CheckButton>
    </S.Wrapper>
  );
}

export { ErrorResponseModal };
