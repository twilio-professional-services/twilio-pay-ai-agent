import { config } from "../../../config";
import { Twilio } from "twilio";

const twilioClient = new Twilio(config.twilio.accountSid, config.twilio.authToken);

export interface captureExpirationDateParams {
  callSid: string;
  paymentSid: string;
}

export async function captureExpirationDate(params: captureExpirationDateParams): Promise<string | null> {

  console.log("Capture expiration date", params);

  // const sessionData = {
  //   idempotencyKey: params.callSid + Date.now().toString(),
  //   statusCallback: "",
  //   // tokenType: this.tokenType,
  //   currency: "USD",
  //   chargeAmount: 1,
  //   paymentConnector: "stripe_connector",
  //   securityCode: true,
  //   postalCode: false
  // }
  
 try {
    const paymentSession = await twilioClient
        .calls(params.callSid)
        .payments(params.paymentSid)
        .update({
            capture: "expiration-date", 
            idempotencyKey: params.callSid + Date.now().toString(),
            statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
        });

    // Store the new data in the callbackData map, using the Sid as the key
    // this.statusCallbackMap.set(paymentSid, paymentSession);

    return "Ask the caller to enter the expiration date using the key pad."; // Pay Object
} catch (error) {
    //const message = `Error with captureCard for callSID: ${callSid} - ${error} `;
    // this.emit(LOG_EVENT, { level: 'error', message });
    return null;
}
}