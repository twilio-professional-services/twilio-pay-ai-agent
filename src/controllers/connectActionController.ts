import twilio from "twilio";
import { config } from "../config";
import logger from "../utils/logger";

export async function handleConnectAction(actionPayload: any) {
  try {
    logger.info("Connect Action Payload", { actionPayload });

    if (actionPayload.CallStatus === "completed") {
      logger.info("Call completed");
      return;
    }

    const voiceResponse = new twilio.twiml.VoiceResponse();

    if (!actionPayload.HandoffData) {
      console.log("No HandoffData - Call can be be ended");
      return voiceResponse.hangup().toString();
    }

    const workflowSid = config.twilio.workflowSid;
    const transferPhoneNumber = config.twilio.transferPhoneNumber;

    if (!workflowSid && !transferPhoneNumber) {
      logger.error("Workflow SID or transfer phone number is not set");
    }

    if (workflowSid) {
      return voiceResponse
        .enqueue({ workflowSid: workflowSid })
        .task(JSON.stringify({"handOffData" : actionPayload.HandoffData}))
        .toString();
    } else if (transferPhoneNumber) {
      voiceResponse.dial().number(config.twilio.transferPhoneNumber);
      return voiceResponse.toString();
    }
  } catch (error) {
    logger.error("Error handling connect action", { error });
  }
}
