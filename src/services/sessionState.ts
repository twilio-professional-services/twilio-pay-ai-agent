import { WebSocket } from "ws";
import { LLMService } from "./llm/llmService";
// A Map to store session state with IDs as keys and reference to llmService and data as values
const sessionState = new Map<string, { llmService: LLMService; data: any }>();

export interface PaymentFlowData {
  creditCardNumber: string;
  expirationDate: string;
  securityCode: string;
  creditCardType?: string;
  creditCardCaptureComplete?: boolean;
  expirationDateCaptureComplete?: boolean;
  securityCodeCaptureComplete?: boolean;
  paymentCaptureComplete?: boolean;
  paymentStatus?: string;
  paymentError?: string;
  paymentSid?: string;
  callSid?: string;
  paymentConnector?: string;
  chargeAmount?: number;
  currency?: string;
  confirmationCode?: string;
}

export function addSession(id: string, llmService: LLMService) {
  const initialData: PaymentFlowData = {
    creditCardNumber: "",
    expirationDate: "",
    securityCode: "",
  };
  sessionState.set(id, { llmService, data: initialData });
}

export function getSession(id: string) {
  return sessionState.get(id);
}

export function updateSessionData(id: string, data: any) {
  const session = sessionState.get(id);
  if (session) {
    session.data = { ...session.data, ...data };
  }
}

export function removeSession(id: string) {
  sessionState.delete(id);
}

export function getAllSessions() {
  return Array.from(sessionState.values());
}