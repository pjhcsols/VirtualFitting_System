import { API_BASILIUM } from "@/shared";
import { PaymentRequestParams, PaymentResponse, PaymentResultParams } from "@/shared";

export const createPaymentReservation = async (
  params: PaymentRequestParams
): Promise<PaymentResponse | null> => {
  try {
    const response = await API_BASILIUM.post("/b1/payment/request", null, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Payment request failed:", error);
    return null;
  }
};

export async function handlePaymentResponse(params: PaymentResultParams): Promise<string> {
  try {
    const response = await API_BASILIUM.post("/b1/payment/response", null, {
      params: {
        taskId: params.taskId,
        success: params.success,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Payment result processing failed:", error);
    throw error;
  }
}
