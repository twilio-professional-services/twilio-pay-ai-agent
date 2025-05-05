import { config } from "../../../config";
import { twilioClient } from "./toolHelpers";
import logger from "../../../utils/logger";

export interface capturePaymentCardNumberParams {
  callSid: string;
  paymentSid: string;
}

export async function capturePaymentCardNumber(
  params: capturePaymentCardNumberParams
): Promise<string | null> {

  logger.info("Capture payment card params", { params });

  try {
    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments(params.paymentSid)
      .update({
        capture: "payment-card-number", // Replace with a valid PaymentCapture value
        idempotencyKey: params.callSid + Date.now().toString(),
        statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
      });

    return "Ask the caller to enter the payment card number using the key pad."; // Pay Object
  } catch (error) {

    logger.error("Error capturing payment card number", { error });
    return null;
  }
}
