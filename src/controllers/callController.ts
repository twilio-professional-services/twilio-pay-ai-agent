import { CallDetails } from "../types";
import { config } from "../config";
// import { switchLanguage } from '../services/llm/tools/switchLanguage';

export async function handleIncomingCall(
  callData: CallDetails
): Promise<string> {
  // Validate and process incoming call
  if (!callData) {
    throw new Error("Invalid call data");
  }

  const languageElements = Object.keys(config.languages)
    .map((key) => {
      const language = config.languages[key];
      let attributes = `code="${language.locale_code}"`;

      if (language.ttsProvider) {
        attributes += ` ttsProvider="${language.ttsProvider}"`;
      }
      if (language.voice) {
        attributes += ` voice="${language.voice}"`;
      }
      if (language.transcriptionProvider) {
        attributes += ` transcriptionProvider="${language.transcriptionProvider}"`;
      }
      if (language.speechModel) {
        attributes += ` speechModel="${language.speechModel}"`;
      }

      return `<Language ${attributes} />`;
    })
    .join("\n");

  // Refer the ConversationRelay docs for a complete list of attributes - https://www.twilio.com/docs/voice/twiml/connect/conversationrelay#conversationrelay-attributes
  return `<Response>                     
              <Connect action="https://${config.ngrok.domain}/api/action">
                <ConversationRelay url="wss://${config.ngrok.domain}" dtmfDetection="true" interruptByDtmf="false" interruptible="true" welcomeGreetingInterruptible="true" welcomeGreeting="${config.twilio.welcomeGreeting}">  
                     ${languageElements}
                </ConversationRelay>
            </Connect>
          </Response>`;
}
