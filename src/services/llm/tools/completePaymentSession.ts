import { config } from "../../../config";
import { twilioClient } from "./toolHelpers";
import logger from "../../../utils/logger";

export interface completePaymentProcessingParams {
  callSid: string;
  paymentSid: string;
}

export async function completePaymentSession(
  params: completePaymentProcessingParams
): Promise<string | null> {
  logger.info("Complete payment processing", { params });

  try {
    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments(params.paymentSid)
      .update({
        status: "complete",
        idempotencyKey: params.callSid + Date.now().toString(),
        statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
      });

    // Store the new data in the callbackData map, using the Sid as the key
    // this.statusCallbackMap.set(paymentSid, paymentSession);

    return "information sent to processer. do not respond to the user. wait until you get confirmation message back"; // Pay Object
  } catch (error) {
    logger.error("Error while completing payment session", { error });
    return null;
  }
}
