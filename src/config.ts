import dotenv from "dotenv";
import { z } from "zod";

import { languageOptions } from "./languageOptions";

// Load environment variables
dotenv.config();

// Create a schema for validation
const configSchema = z.object({
  // Twilio Configuration
  TWILIO_ACCOUNT_SID: z.string().min(1, "Twilio Account SID is required"),
  // TWILIO_AUTH_TOKEN: z.string().min(1, "Twilio Auth Token is required"),
 
  TWILIO_API_KEY: z.string().min(1, "Twilio API Key is required"),
  TWILIO_API_SECRET: z.string().min(1, "Twilio Secret is required"),
  TWILIO_PAY_CONNECTOR: z.string().min(1, "Twilio Payment Connector is required"),

  TWILIO_WORKFLOW_SID: z.string().min(1, "Twilio Workflow SID is required"),

  CONFERENCE_CALL: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // Phone Number to Transfer to
  TRANSFER_PHONE_NUMBER: z.string().min(1, "Transfer Phone Number is required"),

  // Ngrok Configuration
  NGROK_DOMAIN: z.string().optional(),

  // Conversation Relay Welcome Greeting
  WELCOME_GREETING: z.string().optional(),

  // Speech Service Configuration
  SPEECH_KEY: z.string().optional(),
  SPEECH_REGION: z.string().optional(),

  // OpenAI Configuration
  OPENAI_API_KEY: z.string().optional(),

  // Optional: Server Port
  PORT: z.string().optional().default("3000"),

});

// Validate and parse the environment variables
let parsedConfig: {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
  TWILIO_PAY_CONNECTOR: string;
  TWILIO_WORKFLOW_SID: string;
  TRANSFER_PHONE_NUMBER: string;
  CONFERENCE_CALL?: string | undefined;
  TWILIO_PHONE_NUMBER?: string | undefined;
  WELCOME_GREETING?: string | undefined;
  PORT?: string | undefined;
  NGROK_DOMAIN?: string | undefined;
  SPEECH_KEY?: string | undefined;
  SPEECH_REGION?: string | undefined;
  OPENAI_API_KEY?: string | undefined;
};

try {
  parsedConfig = configSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Configuration Error:", error.errors);
    throw new Error("Invalid configuration. Please check your .env file.");
  }
  throw error;
}

// Create a config object with typed access
export const config = {
  twilio: {
    accountSid: parsedConfig.TWILIO_ACCOUNT_SID,
    apiKey: parsedConfig.TWILIO_API_KEY,
    apiSecret: parsedConfig.TWILIO_API_SECRET,
    payConnector: parsedConfig.TWILIO_PAY_CONNECTOR,
    workflowSid: parsedConfig.TWILIO_WORKFLOW_SID,
    welcomeGreeting: parsedConfig.WELCOME_GREETING,
    transferPhoneNumber: parsedConfig.TRANSFER_PHONE_NUMBER,
    conferenceCall: parsedConfig.CONFERENCE_CALL,
    twilioPhoneNumber: parsedConfig.TWILIO_PHONE_NUMBER,
  },
  ngrok: {
    domain: parsedConfig.NGROK_DOMAIN,
  },
  speech: {
    key: parsedConfig.SPEECH_KEY,
    region: parsedConfig.SPEECH_REGION,
  },
  openai: {
    apiKey: parsedConfig.OPENAI_API_KEY,
  },
  server: {
    port: parseInt(parsedConfig.PORT || "3000", 10),
  },
  languages: languageOptions,
};

// Utility function to mask sensitive information
export function maskSensitiveConfig(config: typeof parsedConfig) {
  return {
    ...config,
    TWILIO_API_SECRET: config.TWILIO_API_SECRET.slice(0, 3) + "****",
    OPENAI_API_KEY: config.OPENAI_API_KEY
      ? config.OPENAI_API_KEY.slice(0, 5) + "****"
      : undefined,
  };
}

// Optional: Log masked configuration for debugging
if (process.env.NODE_ENV !== "production") {
  console.log("Loaded Configuration:", maskSensitiveConfig(parsedConfig));
}
