import { config } from "../../../config";
import { getSession } from "../../sessionState";
import { CAPTURE_PAYMENT_CARD_NUMBER } from "./toolHelpers";
import { twilioClient } from "./toolHelpers";
import logger from "../../../utils/logger";

export interface captureExpirationDateParams {
  callSid: string;
  paymentSid: string;
}

export async function captureExpirationDate(
  params: captureExpirationDateParams
): Promise<string | null> {
  try {
    logger.info("Capture expiration date params", { params });

    const sessionData = await getSession(params.callSid);

    if (!sessionData) {
      logger.error("Session data not found for callSid:", params.callSid);
      return null;
    }

    if (!sessionData.data.creditCardCaptureComplete) {
      return `The previous step, credit card number capture, was not completed. Please restart that step by calling the ${CAPTURE_PAYMENT_CARD_NUMBER} tool.`;
    }

    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments(params.paymentSid)
      .update({
        capture: "expiration-date",
        idempotencyKey: params.callSid + Date.now().toString(),
        statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
      });

    return "Ask the caller to enter the expiration date using the key pad."; // Pay Object
  } catch (error) {
    logger.error("Error capturing expiration date", { error });
    return null;
  }
}
