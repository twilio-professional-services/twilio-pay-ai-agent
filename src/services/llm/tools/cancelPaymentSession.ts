import { config } from "../../../config";
import {twilioClient} from "./toolHelpers";
import logger from "../../../utils/logger";

export interface cancelPaymentProcessingParams {
  callSid: string;
  paymentSid: string;
}

export async function cancelPaymentSession(
  params: cancelPaymentProcessingParams
): Promise<string | null> {

  logger.info("cancel payment processing", { params });

  try {
    if (!config.ngrok.domain) {
      throw new Error("Ngrok domain is not configured. Please check the configuration.");
    }

    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments(params.paymentSid)
      .update({
        status: "cancel",
        idempotencyKey: params.callSid + Date.now().toString(),
        statusCallback: `https://${config.ngrok.domain}/api/status-callback`, 
      });

    return "Initiating cancellation of payment session. Do not respond to the user. Wait until you get the cancelling message back."; 
  } catch (error) {
    // Log the error for debugging purposes
    logger.error("Error while cancelling payment session", { error });
    return null;
  }
}
