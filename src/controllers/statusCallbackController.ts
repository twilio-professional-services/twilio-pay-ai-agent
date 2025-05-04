
import { getSession, updateSessionData } from "../services/sessionState";

import {
  CAPTURE_PAYMENT_CARD_NUMBER,
  CAPTURE_SECURITY_CODE,
  CAPTURE_EXPIRATION_DATE,
  COMPLETE_PAYMENT_PROCESSING,
  INPUT_TIMEOUT,
  PAYMENT_CARD_NUMBER,
  EXPIRATION_DATE,
  SECURITY_CODE
} from "../services/llm/tools/toolHelpers";

export async function handleStatusCallback(actionPayload: any) {
  try {
    console.log("Status Callback Payload", actionPayload);

    if (actionPayload.ErrorType) {
      console.log("Error occurred", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        if (
          actionPayload.ErrorType === INPUT_TIMEOUT &&
          actionPayload.Capture === PAYMENT_CARD_NUMBER
        ) {
          value.llmService.asyncToolCallResult(
            `Error occurred while capturing payment card number. Let the user know there was an issue and ask have them to try again after calling ${CAPTURE_PAYMENT_CARD_NUMBER} tool .`
          );
        }
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }
      return;
    }

    if (
      actionPayload.PaymentCardType &&
      actionPayload.Capture === PAYMENT_CARD_NUMBER &&
      actionPayload.Required &&
      !actionPayload.Required.includes(PAYMENT_CARD_NUMBER)
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
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;
    } else if (
      actionPayload.Capture === SECURITY_CODE &&
      actionPayload.Required &&
      !actionPayload.Required.includes(SECURITY_CODE)
    ) {
      console.log("Security code captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
          `security code captured successfully. Next step is to send all card information by calling ${COMPLETE_PAYMENT_PROCESSING}. Do not respond to user.`
        );
      } else {
        console.log("No session found for CallSid:", actionPayload.CallSid);
      }

      return;
    } else if (
      actionPayload.Capture === EXPIRATION_DATE &&
      actionPayload.Required &&
      !actionPayload.Required.includes(EXPIRATION_DATE)
    ) {
      console.log("Expiration date captured successfully", actionPayload);
      const value = getSession(actionPayload.CallSid);
      if (value) {
        value.llmService.asyncToolCallResult(
          `Expiration date captured successfully. Next step is to capture the security code by calling ${CAPTURE_SECURITY_CODE} tool.`
        );
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
