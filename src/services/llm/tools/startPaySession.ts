import { config } from "../../../config";
import { CAPTURE_PAYMENT_CARD_NUMBER } from "./toolHelpers";
import { twilioClient } from "./toolHelpers";
import logger from "../../../utils/logger";

export interface startPaySessionParams {
  callSid: string;
}

export async function startPaySession(
  params: startPaySessionParams
): Promise<string | null> {
  logger.info("Payment session params", { params });

  const sessionData = {
    idempotencyKey: params.callSid + Date.now().toString(),
    statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
    // tokenType: this.tokenType,
    currency: "USD",
    chargeAmount: 1,
    paymentConnector: "stripe_connector",
    //timeout:60,
    securityCode: true,
    postalCode: false,
  };

  // Now create the payment session
  try {
    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments.create(sessionData);

    logger.info("Payment session created", { paymentSession });
    // Return the Payment session Sid for this Call Sid
    return `Payment session started with Pay Sid: ${paymentSession.sid} , next call the ${CAPTURE_PAYMENT_CARD_NUMBER} use Pay Sid: ${paymentSession.sid} tool to capture the card number`;
  } catch (error) {
    logger.error("Error creating payment session", { error });
    return null;
  }
}
