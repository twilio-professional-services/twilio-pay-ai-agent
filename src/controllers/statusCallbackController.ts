import { getSession, updateSessionData } from "../services/sessionState";
import logger from "../utils/logger";
import {
  CAPTURE_PAYMENT_CARD_NUMBER,
  CAPTURE_SECURITY_CODE,
  CAPTURE_EXPIRATION_DATE,
  COMPLETE_PAYMENT_PROCESSING,
  INPUT_TIMEOUT,
  PAYMENT_CARD_NUMBER,
  EXPIRATION_DATE,
  SECURITY_CODE,
  INVALID_CARD_NUMBER,
  INVALID_EXPIRATION_DATE,
  INVALID_SECURITY_CODE,
} from "../services/llm/tools/toolHelpers";

export async function handleStatusCallback(actionPayload: any) {
  try {
    logger.info("Status Callback Payload", actionPayload);

    // Check if the actionPayload has an ErrorType property
    if (actionPayload.ErrorType) {
      handleErrorType(actionPayload);
      return;
    }

    // Check if the 'payment-card-number' requirement is met
    if (isPaymentCardCaptured(actionPayload)) {
      handlePaymentCardCaptured(actionPayload);
      return;
    }

    // Check if the 'security-code' requirement is met
    if (isSecurityCodeCaptured(actionPayload)) {
      handleSecurityCodeCaptured(actionPayload);
      return;
    }

    // Check if the 'expiration-date' requirement is met
    if (isExpirationDateCaptured(actionPayload)) {
      handleExpirationDateCaptured(actionPayload);
      return;
    }

    // Check is all required data is captured
    if (isAllDataCaptured(actionPayload)) {
      handleAllDataCaptured(actionPayload);
      return;
    }

    logger.info("Status Callback no condition matched", actionPayload);
  } catch (error) {
    logger.error("An error occurred:", error);
  }
}

function handleErrorType(actionPayload: any) {
  logger.log("Error occurred", actionPayload);
  const session = getSession(actionPayload.CallSid);
  if (session) {
    if (
      actionPayload.ErrorType === INPUT_TIMEOUT &&
      actionPayload.Capture === PAYMENT_CARD_NUMBER
    ) {
      session.llmService.asyncToolCallResult(
        `Error occurred while capturing payment card number. Let the user know there was an issue and ask them to try again after calling ${CAPTURE_PAYMENT_CARD_NUMBER} tool.`
      );
    } else if (
      actionPayload.ErrorType === INPUT_TIMEOUT &&
      actionPayload.Capture === SECURITY_CODE
    ) {
      session.llmService.asyncToolCallResult(
        `Error occurred while capturing security code. Let the user know there was an issue and ask them to try again after calling ${CAPTURE_SECURITY_CODE} tool.`
      );
    } else if (
      actionPayload.ErrorType === INPUT_TIMEOUT &&
      actionPayload.Capture === EXPIRATION_DATE
    ) {
      session.llmService.asyncToolCallResult(
        `Error occurred while capturing expiration date. Let the user know there was an issue and ask them to try again after calling ${CAPTURE_EXPIRATION_DATE} tool.`
      );
    } else if (
      actionPayload.ErrorType === INVALID_CARD_NUMBER &&
      actionPayload.Capture === PAYMENT_CARD_NUMBER
    ) {
      session.llmService.asyncToolCallResult(
        `Invalid Card Number. Let the user know and ask them to try again after calling ${CAPTURE_PAYMENT_CARD_NUMBER} tool.`
      );
    } else if (
      actionPayload.ErrorType === INVALID_EXPIRATION_DATE &&
      actionPayload.Capture === EXPIRATION_DATE
    ) {
      session.llmService.asyncToolCallResult(
        `Invalid Expiration Date. Let the user know and ask them to try again after calling ${CAPTURE_EXPIRATION_DATE} tool.`
      );
    } else if (
      actionPayload.ErrorType === INVALID_SECURITY_CODE &&
      actionPayload.Capture === SECURITY_CODE
    ) {
      session.llmService.asyncToolCallResult(
        `Invalid Security Code. Let the user know and ask them to try again after calling ${CAPTURE_SECURITY_CODE} tool.`
      );
    }
  } else {
    logger.error("No session found for CallSid:", actionPayload.CallSid);
  }
}

function isPaymentCardCaptured(actionPayload: any): boolean {
  return (
    actionPayload.Capture === PAYMENT_CARD_NUMBER &&
    actionPayload.PaymentCardType &&
    actionPayload.Required &&
    !actionPayload.Required.includes(PAYMENT_CARD_NUMBER)
  );
}

function handlePaymentCardCaptured(actionPayload: any) {
  logger.info("Payment Card captured successfully", actionPayload);
  const session = getSession(actionPayload.CallSid);
  if (session) {
    const sessionData = getSession(actionPayload.CallSid);
    if (sessionData) {
      const cardData = {
        creditCardType: actionPayload.PaymentCardType,
        creditCardNumber: actionPayload.PaymentCardNumber,
        creditCardCaptureComplete: true,
      };

      updateSessionData(actionPayload.CallSid, cardData);
    }

    session.llmService.asyncToolCallResult(
      `Credit card number captured successfully. Next step is to capture the expiration date by calling ${CAPTURE_EXPIRATION_DATE}.`
    );
  } else {
    logger.error("No session found for CallSid:", actionPayload.CallSid);
  }
}

function isSecurityCodeCaptured(actionPayload: any): boolean {
  return (
    actionPayload.Capture === SECURITY_CODE &&
    actionPayload.Required &&
    !actionPayload.Required.includes(SECURITY_CODE)
  );
}

function handleSecurityCodeCaptured(actionPayload: any) {
  logger.info("Security code captured successfully", actionPayload);
  const sessionData = getSession(actionPayload.CallSid);
  if (sessionData) {
    const cardSecurityCodeData = {
      securityCode: actionPayload.SecurityCode,
      securityCodeCaptureComplete: true,
    };
    updateSessionData(actionPayload.CallSid, cardSecurityCodeData);
    sessionData.llmService.asyncToolCallResult(
      `Security code captured successfully. Next step is to send all card information by calling ${COMPLETE_PAYMENT_PROCESSING}. Do not respond to user.`
    );
  } else {
    logger.error("No session found for CallSid:", actionPayload.CallSid);
  }
}

function isExpirationDateCaptured(actionPayload: any): boolean {
  return (
    actionPayload.Capture === EXPIRATION_DATE &&
    actionPayload.ExpirationDate &&
    actionPayload.Required &&
    !actionPayload.Required.includes(EXPIRATION_DATE)
  );
}

function handleExpirationDateCaptured(actionPayload: any) {
  logger.info(
    "Expiration date captured successfully",
    actionPayload
  );
  const session = getSession(actionPayload.CallSid);
  if (session) {
    const cardExpirationData = {
      expirationDate: actionPayload.ExpirationDate,
      expirationDateCaptureComplete: true,
    };
    updateSessionData(actionPayload.CallSid, cardExpirationData);

    session.llmService.asyncToolCallResult(
      `Expiration date captured successfully. Next step is to capture the security code by calling ${CAPTURE_SECURITY_CODE} tool.`
    );
  } else {
    logger.error("No session found for CallSid:", actionPayload.CallSid);
  }
}

function isAllDataCaptured(actionPayload: any): boolean {
  return (
    actionPayload.PaymentCardNumber &&
    actionPayload.ExpirationDate &&
    actionPayload.SecurityCode &&
    actionPayload.Required === "" &&
    actionPayload.PartialResult !== "true"
  );
}

function handleAllDataCaptured(actionPayload: any) {
  logger.info(
    "All the data has been captured successfully",
    actionPayload
  );
  const session = getSession(actionPayload.CallSid);
  if (session) {
    session.llmService.asyncToolCallResult("Payment successful.");
  } else {
    logger.error("No session found for CallSid:", actionPayload.CallSid);
  }
}
