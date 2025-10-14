export const formatPhoneNumber = (phoneNumber?: string): string => {
  if (!phoneNumber) {
    return "";
  }
  const cleaned = phoneNumber.replace(/\D/g, "").replace(/^82/, "0");

  if (cleaned.match(/^(010|011|016|017|018|019)/)) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  return cleaned;
};
