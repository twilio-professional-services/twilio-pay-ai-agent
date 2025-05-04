import { config } from "../../../config";

import {twilioClient} from "./toolHelpers";

export interface cancelPaymentProcessingParams {
  callSid: string;
  paymentSid: string;
}

export async function cancelPaymentSession(
  params: cancelPaymentProcessingParams
): Promise<string | null> {
  console.log("cancel payment processing", params);

  try {
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
    return null;
  }
}
