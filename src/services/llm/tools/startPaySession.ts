import { config } from "../../../config";
import { Twilio } from "twilio";

const twilioClient = new Twilio(config.twilio.accountSid, config.twilio.authToken);

export interface startPaySessionParams {
  callSid: string;

}

export async function startPaySession(params: startPaySessionParams): Promise<string | null> {

  console.log("Payment session params", params);

  const sessionData = {
    idempotencyKey: params.callSid + Date.now().toString(),
    statusCallback: `https://${config.ngrok.domain}/api/status-callback`, // Replace with your actual status callback URL
    // tokenType: this.tokenType,
    currency: "USD",
    chargeAmount: 1,
    paymentConnector: "stripe_connector",
    securityCode: true,
    postalCode: false
  }
  
  // Now create the payment session
  try {
   const paymentSession = await twilioClient.calls(params.callSid)
        .payments
        .create(sessionData);
  
    // store the data in the callbackData map, using the Sid as the key
    // this.statusCallbackMap.set(paymentSession.sid, paymentSession);
  
    // // Emit a log event for starting the capture
    // this.emit(LOG_EVENT, { level: 'info', message: `Started payment SID: ${paymentSession.sid} this.StatusCallbackMap: ${JSON.stringify(this.statusCallbackMap.get(paymentSession.sid), null, 2)}` });
  
    console.log("Payment session created", paymentSession);
    // Return the Payment session Sid for this Call Sid
    return `Payment session started with Pay Sid: ${paymentSession.sid} , next call the capture_payment_card_number use Pay Sid: ${paymentSession.sid} tool to capture the card number`;
  } catch (error) {
    // const message = `Error with StartCapture for callSID: ${callSid} - ${error} `;
    // this.emit(LOG_EVENT, { level: 'error', message });
   return null;
  }
}




