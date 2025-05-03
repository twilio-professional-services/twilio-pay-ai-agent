import { string } from "zod";
import { getSession, updateSessionData } from "../services/sessionState";

import {
  CAPTURE_PAYMENT_CARD_NUMBER,
  CAPTURE_SECURITY_CODE,
  CAPTURE_EXPIRATION_DATE,
  COMPLETE_PAYMENT_PROCESSING,
} from "../services/llm/tools/toolConstants";

export async function handleStatusCallback(actionPayload: any) {
  try {


    console.log("Status Callback Payload", actionPayload);

    if (actionPayload.ErrorType) {
      console.log("Error occurred", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        if (
          actionPayload.ErrorType === "input-timeout" &&
          actionPayload.Capture === "payment-card-number"
        ) {
          value.llmService.asyncToolCallResult(
            `Error occurred while capturing payment card number. Let the user know there was an issue and ask have them to try again after calling ${CAPTURE_PAYMENT_CARD_NUMBER} tool .`
          );
        }
        // value.llmService.asyncToolCallResult(
        // "Error occurred while capturing payment card number. Please try again."
        // );
        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }
      return;
    }

    if (
      actionPayload.PaymentCardType &&
      actionPayload.Capture === "payment-card-number" &&
      actionPayload.Required &&
      !actionPayload.Required.includes("payment-card-number")
    ) {
      console.log("Payment Card captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        const sessionData = getSession(actionPayload.CallSid);
        if (sessionData) {
          sessionData.data.creditCardType = actionPayload.PaymentCardType;
          sessionData.data.creditCardNumber = actionPayload.PaymentCardNumber;
          sessionData.data.creditCardCaptureComplete = true;
          updateSessionData(actionPayload.CallSid, sessionData);
        }

        value.llmService.asyncToolCallResult(
          `credit card number captured successfully. Next step is to capture the expiration date by calling ${CAPTURE_EXPIRATION_DATE} .`
        );

        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;
    } else if (
      actionPayload.Capture === "security-code" &&
      actionPayload.Required &&
      !actionPayload.Required.includes("security-code")
    ) {
      console.log("Security code captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
          `security code captured successfully. Next step is to send all card information by calling ${COMPLETE_PAYMENT_PROCESSING}. Do not respond to user.`);
        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;
    } else if (
      actionPayload.Capture === "expiration-date" &&
      actionPayload.Required &&
      !actionPayload.Required.includes("expiration-date")
    ) {
      console.log("Expiration date captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
          `Expiration date captured successfully. Next step is to capture the security code by calling ${CAPTURE_SECURITY_CODE} tool.`
        );
        // Emit an event or perform any other action with the session value
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }
      return;
    } else if (
      actionPayload.PaymentCardNumber &&
      actionPayload.ExpirationDate &&
      actionPayload.SecurityCode &&
      actionPayload.Required !== "" &&
      actionPayload.PartialResult !== "true"
    ) {
      console.log("All the data has been captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult("payment sucessfull .");
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
