import { Twilio } from "twilio";
import {config} from "../../../config";
import { INPUT } from "@langchain/langgraph/dist/constants";

export const VERIFY_USER = "verify_user";
export const CHECK_PENDING_BILL = "check_pending_bill";
export const START_PAYMENT = "start_payment";
export const CAPTURE_PAYMENT_CARD_NUMBER = "capture_payment_card_number";
export const CAPTURE_SECURITY_CODE = "capture_security_code";
export const CAPTURE_EXPIRATION_DATE = "capture_expiration_date";
export const COMPLETE_PAYMENT_PROCESSING = "complete_payment_processing";
export const CANCEL_PAYMENT_PROCESSING = "cancel_payment_processing";
export const HUMAN_AGENT_HANDOFF = "human_agent_handoff";


export const PAYMENT_CARD_NUMBER = "payment-card-number";
export const EXPIRATION_DATE = "expiration-date";
export const SECURITY_CODE = "security-code";
export const INVALID_CARD_NUMBER = "invalid-card-number";
export const INVALID_EXPIRATION_DATE = "invalid-expiration-date";
export const INVALID_SECURITY_CODE = "invalid-security-code";
export const INPUT_TIMEOUT = "input-timeout";

const { accountSid, apiKey, apiSecret } = config.twilio;
export const twilioClient = new Twilio(apiKey, apiSecret, {accountSid: accountSid});