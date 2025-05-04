import twilio from "twilio";

export async function handleJoinConferenceAction(conferenceId: string) {
  const voiceResponse = new twilio.twiml.VoiceResponse();
  voiceResponse.dial().conference(
    {
      startConferenceOnEnter: true,
      endConferenceOnExit: true,
    },
    conferenceId
  );

  return voiceResponse.toString();
}