export interface LanguageOption {
  locale_code: string;
  ttsProvider?: string;
  voice?: string;
  transcriptionProvider?: string;
  speechModel?: string;
}

export const languageOptions: { [key: string]: LanguageOption } = {
  spanish: {
    locale_code: "es-US",
    // ttsProvider: "google",
    // voice: "es-US-Journey-F", // "Lucia-Generative", // "", //"Lucia-Generative", ///"es-US-Journey-F",
    ttsProvider: "Elevenlabs", // "google",
    voice: "56AoDkrOh6qfVPDXZ7Pt", // "en-US-Journey-O",
    transcriptionProvider: "deepgram", // "google",
    speechModel: "nova-2-general", // "telephony",
  },
  english: {
    locale_code: "en-US",
    ttsProvider: "Elevenlabs", // "google",
    voice: "g6xIsTj2HwM6VR4iXFCw", // "en-US-Journey-O",
    transcriptionProvider: "deepgram", // "google",
    speechModel: "nova-2-general", // "telephony",
  },
};

// Elevenlabs voices
// Dakota H - P7x743VjyZEOihNNygQ9
// Evie, 
// Jessica Anne - flHkNRp1BlvT73UL6gyz
// Aunt Annie
// Dr. Renetta.

// Other examples of language options:
//   'hi-IN': 'hi-IN-Wavenet-A',
//   'fr-FR': 'fr-FR-Journey-F',
//   'cmn-CN': 'cmn-CN-Wavenet-A',
