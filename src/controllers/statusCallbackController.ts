
import { getSession, updateSessionData } from "../services/sessionState";

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
    console.log("Status Callback Payload", actionPayload);

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

    console.log("Status Callback no condition matched", actionPayload);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function handleErrorType(actionPayload: any) {
  console.log("Error occurred", actionPayload);
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
    }
     else if (
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
    }
    else if (
      actionPayload.ErrorType === INVALID_SECURITY_CODE &&
      actionPayload.Capture === SECURITY_CODE
    ) {
      session.llmService.asyncToolCallResult(
        `Invalid Security Code. Let the user know and ask them to try again after calling ${CAPTURE_SECURITY_CODE} tool.`
      );
    }
  } else {
    console.log("No session found for CallSid:", actionPayload.CallSid);
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
  console.log("Payment Card captured successfully", actionPayload);
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
    console.log("No session found for CallSid:", actionPayload.CallSid);
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
  console.log("Security code captured successfully", actionPayload);
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
    console.log("No session found for CallSid:", actionPayload.CallSid);
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
  console.log("Expiration date captured successfully", actionPayload);
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
    console.log("No session found for CallSid:", actionPayload.CallSid);
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
  console.log("All the data has been captured successfully", actionPayload);
  const session = getSession(actionPayload.CallSid);
  if (session) {
    session.llmService.asyncToolCallResult("Payment successful.");
  } else {
    console.log("No session found for CallSid:", actionPayload.CallSid);
  }
}
// export async function handleStatusCallback(actionPayload: any) {
//   try {
//     console.log("Status Callback Payload", actionPayload);

//     if (actionPayload.ErrorType) {
//       console.log("Error occurred", actionPayload);
//       const value = getSession(actionPayload.CallSid);
//       if (value) {
//         if (
//           actionPayload.ErrorType === INPUT_TIMEOUT &&
//           actionPayload.Capture === PAYMENT_CARD_NUMBER
//         ) {
//           value.llmService.asyncToolCallResult(
//             `Error occurred while capturing payment card number. Let the user know there was an issue and ask have them to try again after calling ${CAPTURE_PAYMENT_CARD_NUMBER} tool .`
//           );
//         }
//       } else {
//         console.log("No session found for CallSid:", actionPayload.CallSid);
//       }
//       return;
//     }

//     if (
//       actionPayload.PaymentCardType &&
//       actionPayload.Capture === PAYMENT_CARD_NUMBER &&
//       actionPayload.Required &&
//       !actionPayload.Required.includes(PAYMENT_CARD_NUMBER)
//     ) {
//       console.log("Payment Card captured successfully", actionPayload);
//       const value = getSession(actionPayload.CallSid);
//       if (value) {
//         const sessionData = getSession(actionPayload.CallSid);
//         if (sessionData) {
//           sessionData.data.creditCardType = actionPayload.PaymentCardType;
//           sessionData.data.creditCardNumber = actionPayload.PaymentCardNumber;
//           sessionData.data.creditCardCaptureComplete = true;
//           updateSessionData(actionPayload.CallSid, sessionData);
//         }

//         value.llmService.asyncToolCallResult(
//           `credit card number captured successfully. Next step is to capture the expiration date by calling ${CAPTURE_EXPIRATION_DATE} .`
//         );
//       } else {
//         console.log("No session found for CallSid:", actionPayload.CallSid);
//       }

//       return;
//     } else if (
//       actionPayload.Capture === SECURITY_CODE &&
//       actionPayload.Required &&
//       !actionPayload.Required.includes(SECURITY_CODE)
//     ) {
//       console.log("Security code captured successfully", actionPayload);
//       const value = getSession(actionPayload.CallSid);
//       if (value) {
//         value.llmService.asyncToolCallResult(
//           `security code captured successfully. Next step is to send all card information by calling ${COMPLETE_PAYMENT_PROCESSING}. Do not respond to user.`
//         );
//       } else {
//         console.log("No session found for CallSid:", actionPayload.CallSid);
//       }

//       return;
//     } else if (
//       actionPayload.Capture === EXPIRATION_DATE &&
//       actionPayload.Required &&
//       !actionPayload.Required.includes(EXPIRATION_DATE)
//     ) {
//       console.log("Expiration date captured successfully", actionPayload);
//       const value = getSession(actionPayload.CallSid);
//       if (value) {
//         value.llmService.asyncToolCallResult(
//           `Expiration date captured successfully. Next step is to capture the security code by calling ${CAPTURE_SECURITY_CODE} tool.`
//         );
//       } else {
//         console.log("No session found for CallSid:", actionPayload.CallSid);
//       }
//       return;
//     } else if (
//       actionPayload.PaymentCardNumber &&
//       actionPayload.ExpirationDate &&
//       actionPayload.SecurityCode &&
//       actionPayload.Required !== "" &&
//       actionPayload.PartialResult !== "true"
//     ) {
//       console.log("All the data has been captured successfully", actionPayload);
//       const value = getSession(actionPayload.CallSid);
//       if (value) {
//         value.llmService.asyncToolCallResult("payment sucessfull .");
//       } else {
//         console.log("No session found for CallSid:", actionPayload.CallSid);
//       }
//       return;
//     }

//     console.log("Status Callback no condition mached", actionPayload);

//     return;
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }
