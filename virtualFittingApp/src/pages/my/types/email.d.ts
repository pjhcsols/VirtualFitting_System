export type EmailVerificationInputProps = {
  authCode: string;
  onChange: (code: string) => void;
  onVerify: () => void;
};
