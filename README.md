# Voice AI Agent - powered by Twilio ConversationRelay + Twilio Pay

## Overview

The **Voice AI Agent** includes a robust **AI-assisted pay** feature that enables seamless payment processing. The AI Assistant guides users through the payment process step-by-step, ensuring a user friendly experience.


### An Example Flow

The payment flow involves the AI agent guiding the user through a secure and seamless payment process. The caller enters credit card information using the phone keypad (DTMF). Below is an example conversation flow:

1. **Account Verification**  
  - The assistant greets the user and requests account verification details:  
    `"Thank you for calling our payment processing line. I'm your automated assistant, here to help you process your payment today. To get started, I'll need to verify your account. Could you please provide your first name, last name, and date of birth?"`  
    - [User provides information]  
    - `"Thank you. I'm verifying your information now... Great, I've confirmed your identity. According to our records, your current balance is two hundred dollars. Does that amount sound correct to you?"`  
    - [User confirms]

2. **Payment Preference**  
  - The assistant asks for the user's payment preference:  
    `"Would you like to proceed with making a payment for the full amount of two hundred dollars today, or would you prefer to make a partial payment?"`  
    - [User indicates preference]

3. **Initiate Payment Session**  
  - The assistant initiates the secure payment system:  
    `"I'll now help you process a payment for two hundred dollars. I'm initiating our secure payment system..."`  
    - [Initiate payment session by calling `startPaySession`]  
    - Status callback confirms the session initiation.

4. **Capture Card Number**  
  - The assistant requests the user's card number:  
    `"Please enter your card number."`  
    - [User enters card number]  
    - [Initiate card number capture by calling `startPaySession`]  
    - Status callback confirms the card number capture 

5. **Capture Expiration Date**  
  - The assistant requests the card's expiration date:  
    `"Please enter your card's expiration date."`  
    - [User enters expiration date]  
    - [Initiate expiration date capture by calling `captureExpirationDate`]  
    - Status callback confirms the expiration date capture.

6. **Capture Security Code**  
  - The assistant requests the card's security code:  
    `"Please enter your card's security code."`  
    - [User enters security code]  
    - [Initiate security code capture by calling `captureSecurityCode`]  
    - Status callback confirms the security code capture.

7. **Process Payment**  
  - The assistant processes the payment:  
    `"Thank you for providing your payment details. I'm processing your payment now..."`  
    - [Initiate payment processing by calling `completePaymentSession`]  
    - Status callback confirms the payment processing.

8. **Payment Confirmation**  
  - The assistant confirms the payment:  
    `"Your payment has been successfully processed. You should receive a confirmation shortly. Is there anything else I can help you with today?"`  
    - [User responds]


## Features

- REST API endpoint for incoming calls: The application provides a REST API endpoint (`POST /api/incoming-call`) to process incoming calls. This endpoint initiates the Twilio ConversationRelay to enable seamless communication between the caller and the AI Assistant.

- WebSocket real-time communication: The app leverages WebSocket for real-time communication, ensuring low-latency interactions between the AI Assistant and the caller. This is implemented in the `websocketService` module.

- AI-assisted pay: The application includes a feature that allows the AI Assistant to assist callers in completing payments. This ensures a seamless and secure payment process, leveraging the AI's capabilities to guide users through the transaction.

- Uses OpenAI model and ChatCompletion API in `LLMService`: The application integrates OpenAI's language model through the ChatCompletion API to power the AI Assistant's conversational capabilities. It supports both streaming and non-streaming responses, providing flexibility for different use cases.

- Jest for unit testing: The project includes a comprehensive suite of unit tests written with Jest, ensuring code reliability and robustness during development and deployment.

## Prerequisites

- Node.js (v18+)
- npm
- Stripe Account (https://docs.stripe.com/get-started/account)
- Twilio Stripe Pay connector ()


## Setup

### Open ngrok tunnel

When developing & testing locally, you'll need to open an ngrok tunnel that forwards requests to your local development server.
This ngrok tunnel is used for the Twilio ConversationRelay to send and receive data from a websocket.

To spin up an ngrok tunnel, open a Terminal and run:

```
ngrok http 3000
```

Once the tunnel has been initiated, copy the `Forwarding` URL. It will look something like: `https://[your-ngrok-domain].ngrok.app`. You will
need this when configuring environment variables for the middleware in the next section.

Note that the `ngrok` command above forwards to a development server running on port `3000`, which is the default port configured in this application. If you override the `PORT` environment variable covered in the next section, you will need to update the `ngrok` command accordingly.

1. Clone this repository

2. Navigate to the project directory:
   ```sh
   cd twilio-pay-ai-agent
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Copy the sample environment file and configure the environment variables:
   ```sh
   cp .env.sample .env
   ```

Once created, open `.env` in your code editor. You are required to set the following environment variables for the app to function properly:
| Variable Name | Description | Example Value |
|-------------------|--------------------------------------------------|------------------------|
| `NGROK_DOMAIN` | The forwarding URL of your ngrok tunnel initiated above | `[your-ngrok-domain].ngrok.app` |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID, which can be found in the Twilio Console. | `ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token, which is also found in the Twilio Console. | `your_auth_token_here` |
| `TWILIO_WORKFLOW_SID` | The Taskrouter Workflow SID, which is automatically provisioned with your Flex account. Used to enqueue inbound call with Flex agents. To find this, in the Twilio Console go to TaskRouter > Workspaces > Flex Task Assignment > Workflows |`WWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`|
| `WELCOME_GREETING` | The message automatically played to the caller |
| `OPENAI_API_KEY` | Your OpenAI API Key | `your_api_key_here` |

Below is an optional environment variable that has default value that can be overridden:
| `PORT` | The port your local server runs on. | `3000` |

5. In the Twilio Console, go to Phone Numbers > Manage > Active Numbers and select an existing phone number (or Buy a number). In your Phone Number configuration settings, update the first A call comes in dropdown to Webhook and set the URL to https://[your-ngrok-domain].ngrok.app/api/incoming-call, ensure HTTP is set to HTTP POST, and click Save configuration.

### Run the app

Once dependencies are installed, `.env` is set up, and Twilio is configured properly, run the dev server with the following command:

```
npm run dev
```

### Testing the app

With the development server running, you can now begin testing the Voice AI Assistant. Place a call to the configured phone number and start interacting with your AI Assistant

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Compile TypeScript
- `npm start`: Run the production build
- `npm test`: Run unit tests

## API Endpoints

- `POST /api/incoming-call`: Process incoming call - Initiates ConversationRelay (see [src/routes/callRoutes.ts](src/routes/callRoutes.ts))
- `POST /api/action`: Handle connect action - Human agent handoff (see [src/routes/connectActionRoutes.ts](src/routes/connectActionRoutes.ts))

## WebSocket

- Real-time communication setup (see [src/services/llm/websocketService.ts](src/services/llm/websocketService.ts))

## Configuration

- Environment variables are loaded from the `.env` file (see [src/config.ts](src/config.ts))

## Controllers

- `handleIncomingCall`: Processes incoming call (see [src/controllers/callController.ts](src/controllers/callController.ts))
- `handleConnectAction`: Handles connect action (see [src/controllers/connectActionController.ts](src/controllers/connectActionController.ts))

## LLM Services

- `LLMService`: Manages interactions with the language model (see [src/services/llm/llmService.ts](src/services/llm/llmService.ts))

### Tools

To update the `### Tools` section in the README file based on the tools in the `tools` folder, here is the revised content:

### Tools

- `verifyUserIdentity`: Verifies user identity (see src/services/llm/tools/verifyUserIdentity.ts)
- `checkPendingBill`: Checks for pending medical bills (see src/services/llm/tools/checkPendingBill.ts)
- `checkHsaAccount`: Checks if the user has an HSA account (see src/services/llm/tools/checkHsaAccount.ts)
- `checkPaymentOptions`: Provides payment options available to the user (see src/services/llm/tools/checkPaymentOptions.ts)
- `startPaySession`: Starts a payment session (see src/services/llm/tools/startPaySession.ts)
- `capturePaymentCardNumber`: Captures the payment card number from the user (see src/services/llm/tools/capturePaymentCardNumber.ts)
- `captureExpirationDate`: Captures the expiration date of the payment card (see src/services/llm/tools/captureExpirationDate.ts)
- `captureSecurityCode`: Captures the security code of the payment card (see src/services/llm/tools/captureSecurityCode.ts)
- `completePaymentSession`: Completes the payment session (see src/services/llm/tools/completePaymentSession.ts)
- `cancelPaymentSession`: Cancels the payment session (see src/services/llm/tools/cancelPaymentSession.ts)
- `humanAgentHandoff`: Transfers the call to a human agent (see src/services/llm/tools/humanAgentHandoff.ts)
- `switchLanguage`: Switches the language for the session (see src/services/llm/tools/switchLanguage.ts) 


### ConversationRelay Architectural Diagram

![ConversationRelay](docs/conversation-relay.png)


### Data

- Mock data (see [src/data/mock-data.ts](src/data/mock-data.ts))

### License

This project is licensed under the MIT License.