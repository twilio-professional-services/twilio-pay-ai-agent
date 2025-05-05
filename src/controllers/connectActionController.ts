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

    if (!config.twilio.transferPhoneNumber) {
      logger.error("Transfer phone number not set");
      return;
    }

    const voiceResponse = new twilio.twiml.VoiceResponse();

    if (!actionPayload.HandoffData) {
      logger.info("No HandoffData - Call can be be ended");
      return voiceResponse.hangup().toString();
    }

    if (config.twilio.conferenceCall === 'true' && config.twilio.twilioPhoneNumber) {
      const client = twilio(config.twilio.accountSid, config.twilio.authToken);

      await client.calls.create({
        from: config.twilio.twilioPhoneNumber,
        to: config.twilio.transferPhoneNumber,
        url: `https://${config.ngrok.domain}/api/conference/${actionPayload.CallSid}`,
      });

      voiceResponse.dial().conference(
        {
          startConferenceOnEnter: false,
          endConferenceOnExit: true,
        },
        actionPayload.CallSid
      );

      return voiceResponse.toString();
    } else {
      voiceResponse.dial().number(config.twilio.transferPhoneNumber);
      return voiceResponse.toString();
    }
  } catch (error) {
    throw error;
  }
}
