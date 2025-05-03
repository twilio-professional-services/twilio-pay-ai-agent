import { config } from "../../../config";
import { Twilio } from "twilio";
import { getSession } from "../../sessionState";
import { CAPTURE_EXPIRATION_DATE } from "./toolConstants";

const twilioClient = new Twilio(
  config.twilio.accountSid,
  config.twilio.authToken
);

export interface captureSecurityCodeParams {
  callSid: string;
  paymentSid: string;
}

export async function captureSecurityCode(
  params: captureSecurityCodeParams
): Promise<string | null> {
  console.log("Capture security code", params);

  try {
    console.log("Capture expiration date", params);

    const sessionData = await getSession(params.callSid);

    if (!sessionData) {
      console.error("Session data not found for callSid:", params.callSid);
      return null;
    }

    if (!sessionData.data.creditCardCaptureComplete) {
      return `The previous step, capturing expiration date was not completed. Please restart that step by calling the ${CAPTURE_EXPIRATION_DATE} tool.`;
    }

    const paymentSession = await twilioClient
      .calls(params.callSid)
      .payments(params.paymentSid)
      .update({
        capture: "security-code",
        idempotencyKey: params.callSid + Date.now().toString(),
        statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
      });

    return "Ask the caller to enter the security code using the key pad."; // Pay Object
  } catch (error) {
    return null;
  }
}
