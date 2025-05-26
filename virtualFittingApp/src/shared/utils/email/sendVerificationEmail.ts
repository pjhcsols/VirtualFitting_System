import axios from "axios";

export const sendVerificationEmail = async (
  targetEmail: string,
  code: string
): Promise<boolean> => {
  try {
    await axios.post(
      "https://api.smtpexpress.com/send",
      {
        subject: "이메일 인증 코드",
        message: `<p><strong>인증코드:</strong> ${code}</p>`,
        sender: {
          name: "HelloDeveloper",
          email: "emailtest1-1b5702@projects.smtpexpress.com",
        },
        recipients: {
          name: "사용자",
          email: targetEmail,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SMTP_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );
    return true;
  } catch (err) {
    console.error("메일 전송 실패:", err);
    return false;
  }
};
