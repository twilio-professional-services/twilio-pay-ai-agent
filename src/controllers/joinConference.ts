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


// place the initial caller in conference
// oubound call to the transfer number
// answered the call, place them in the same conference