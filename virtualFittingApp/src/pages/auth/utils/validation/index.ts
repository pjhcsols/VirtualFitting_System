/**
 * 이메일 주소의 유효성을 정규 표현식을 사용하여 검사하는 함수
 * @param email 검사할 문자열
 * @returns 이메일 형식에 맞으면 true, 아니면 false
 */
export function validateEmail(email: string): boolean {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  if (!email || email.trim() === "") {
    return false;
  }
  return emailRegex.test(email.toLowerCase());
}

export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
  details: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePassword(password: string): PasswordValidationResult {
  const minLength = 8;
  const specialChars = /[!@#$%^&*]/; // 사용할 특수 문자 목록 정의

  // 각 요구 사항을 정규 표현식으로 검사
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = specialChars.test(password);
  const isMinLength = password.length >= minLength;

  // 모든 조건이 참인지 확인
  const isValid = hasUppercase && hasLowercase && hasSpecialChar && isMinLength;

  let message = "";
  if (isValid) {
    message = "사용 가능한 안전한 비밀번호입니다.";
  } else {
    // 유효성 검사에 실패했을 때 상세 메시지 구성
    const failures: string[] = [];
    if (!isMinLength) failures.push(`최소 ${minLength}자 이상`);
    if (!hasUppercase) failures.push("대문자 1개 이상");
    if (!hasLowercase) failures.push("소문자 1개 이상");
    if (!hasSpecialChar) failures.push("특수 문자 1개 이상");

    message = `비밀번호가 다음 조건을 만족해야 합니다: ${failures.join(", ")}`;
  }

  return {
    isValid,
    message,
    details: {
      minLength: isMinLength,
      hasUppercase,
      hasLowercase,
      hasSpecialChar,
    },
  };
}

export function validatePhonenumber(): boolean {
  return false;
}
