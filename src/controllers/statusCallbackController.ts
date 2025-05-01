
import { string } from "zod";
import {getSession} from "../services/sessionState";

export async function handleStatusCallback(actionPayload: any) {
  try {
    // Your logic here

    console.log("Status Callback Payload", actionPayload);

    if (actionPayload.PaymentCardType && actionPayload.Capture === "payment-card-number" && actionPayload.Required && !actionPayload.Required.includes('payment-card-number')) {
      console.log("Payment Card captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
        "credit card number captured successfully. Next step is to capture the security code by calling capture_security_code ."
        );
        
        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;

    } else if (actionPayload.Capture === "security-code" && actionPayload.Required && !actionPayload.Required.includes('security-code')) {
      console.log("Security code captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
        "security code captured successfully. Next step is to capture the expiration date by calling capture_expiration_date ."
        );
        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;
    }
    else if (actionPayload.Capture === "expiration-date" && actionPayload.Required && !actionPayload.Required.includes('expiration-date')) {
      console.log("Expiration date captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
        "expiration date captured successfully. Next step is to send all card information by calling complete_payment_processing. Do not respond to user."
        );
        // Emit an event or perform any other action with the session value
      } else {    
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }
      return;
    } else if (actionPayload.PaymentCardNumber && actionPayload.ExpirationDate && actionPayload.SecurityCode && actionPayload.Required !== "" && actionPayload.PartialResult !== "true") {
      console.log("All the data has been captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
        "payment sucessfull ."
        );
        // Emit an event or perform any other action with the session value
      } else {    
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }
      return;
    }


    console.log("Status Callback no condition mached", actionPayload);

    return;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
