// import axios from "axios";

// export const sendVerificationEmail = async (
//   targetEmail: string,
//   code: string
// ): Promise<boolean> => {
//   try {
//     await axios.post(
//       "https://api.smtpexpress.com/send",
//       {
//         subject: "이메일 인증 코드",
//         message: `<p><strong>인증코드:</strong> ${code}</p>`,
//         sender: {
//           name: "HelloDeveloper",
//           email: "emailtest1-1b5702@projects.smtpexpress.com",
//         },
//         recipients: {
//           name: "사용자",
//           email: targetEmail,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_SMTP_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return true;
//   } catch (err) {
//     console.error("메일 전송 실패:", err);
//     return false;
//   }
// };
import emailjs from "emailjs-com";

export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  try {
    const templateParams = {
      email: email,
      passcode: code,
    };

    await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_ID, templateParams, import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    return true;
  } catch (error) {
    console.error("EmailJS 전송 오류:", error);
    return false;
  }
};
