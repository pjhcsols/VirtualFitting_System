import { type ChangeEvent, useEffect, useState } from "react";
import { type BrandUserType } from "../types/brandUser";
import { isValidBrandRegistration } from "../api/businessRegisration.action";
import {
  getBrandUserInfo,
  modifyBrandUserInfo,
  postBrandRegistrationFile,
} from "../api/brand.action";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type TCertified = {
  // 사업자 등록증 조회
  isBusinessRegistrationCerified: boolean;
  // 사업자 등록증 제출 확인
  isBusinessRegistrationImageCertified: number;
};

function useBrandUser() {
  const router = useNavigate();
  const [brandUser, setBrandUser] = useState<BrandUserType>({
    userNumber: 0,
    id: "",
    password: "",
    emailAddress: "",
    phoneNumber: "",
    userGrade: "BRONZE",
    loginType: "NORMAL",
    userImageUrl: "",
    userProfileImageUrl: "",
    firmName: "",
    firmAddress: "",
    businessRegistration: "",
    businessRegistrationCertificateImageUrl: "",
    firmWebUrl: "",
    firmEmail: "",
    firmPhone: "",
    saleAllowed: false,
  });
  const [isCertified, setIsCertified] = useState<TCertified>({
    isBusinessRegistrationCerified: false,
    isBusinessRegistrationImageCertified: 0,
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  const onChangeBusinessRegisrationName = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setBrandUser({
      ...brandUser,
      businessRegistration: e.target.value,
    });
  };

  const onSubmitBusinessRegistration = async () => {
    try {
      const res = await isValidBrandRegistration(
        brandUser.businessRegistration,
      );
      const businessRegistrationResponse = await modifyBrandUserInfo(brandUser);
      setBrandUser(businessRegistrationResponse.data);
    } catch (err) {
      if (err instanceof Error) {
        setErrMsg("유효한 번호가 아닙니다.");
      }
      if (isAxiosError(err)) {
        switch (err.status) {
          case 400:
            setErrMsg("회원을 찾을 수 없습니다.");
            break;
          case 403:
            alert("로그인이 만료되었습니다.");
            router("/login");
            break;
          case 500:
            setErrMsg("서버에 문제가 생겼습니다.");
            break;
        }
      }
    }
  };

  const onFileSelect = (file: File | null) => {
    setCertificateFile(file);
  };

  const onSubmitFile = async () => {
    if (!certificateFile) return;
    try {
      const res = await postBrandRegistrationFile(certificateFile);
      alert("파일 업로드를 성공하였습니다.");
      setIsCertified({
        ...isCertified,
        isBusinessRegistrationImageCertified: 1,
      });
    } catch (err) {
      if (err instanceof CustomException) {
        setErrMsg("파일 업로드를 실패하였습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBrandUserInfo();
        setBrandUser(res.data);
        if (res.data.businessRegistration.length !== 0) {
          setIsCertified({
            ...isCertified,
            ["isBusinessRegistrationCerified"]: true,
          });
        }
        if (
          res.data.businessRegistrationCertificateImageUrl.length !== 0 &&
          res.data.saleAllowed
        ) {
          setIsCertified({
            ...isCertified,
            ["isBusinessRegistrationImageCertified"]: 2,
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          setErrMsg("값을 불러들여오지 못하였습니다.");
        }
        if (isAxiosError(err)) {
          switch (err.status) {
            case 400:
              setErrMsg("값을 불러들여오지 못하였습니다.");
              break;
            case 401:
              alert("로그인이 만료되었습니다.");
              router("/login");
              break;
            case 500:
              setErrMsg("서버에 문제가 생겼습니다.");
              break;
          }
        }
      }
    };
    fetchData();
  }, []);

  return {
    brandUser,
    setBrandUser,
    errMsg,
    isCertified,
    onFileSelect,
    onSubmitFile,
    onSubmitBusinessRegistration,
    onChangeBusinessRegisrationName,
  };
}

export { useBrandUser };
