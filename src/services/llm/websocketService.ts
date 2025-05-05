import { WebSocketServer, WebSocket } from "ws";
import LLMService from "./llmService";
import { ConversationRelayMessage } from "../../types";
import { config } from "../../config";
import { DTMFHelper } from "./dtmfHelper";
import logger from "../../utils/logger";

import { addSession } from "./../sessionState";

export function initializeWebSocketHandlers(wss: WebSocketServer) {
  wss.on("connection", (ws: WebSocket) => {
    logger.info("New WebSocket connection");

    const llmService = new LLMService();
    const dtmfHelper = new DTMFHelper();

    ws.on("message", (message: string) => {
      try {
        const parsedMessage: ConversationRelayMessage = JSON.parse(message);
        logger.info("Received message", { parsedMessage });
        switch (parsedMessage.type) {
          case "prompt":
            llmService.streamChatCompletion([
              { role: "user", content: parsedMessage.voicePrompt },
            ]);
            break;
          case "setup":
            // store session data
            addSession(parsedMessage.callSid, llmService);
            llmService.setup(parsedMessage);
            break;
          case "error":
            // Handle error case if needed
            logger.warn("Error message", parsedMessage);

            break;
          case "interrupt":
            llmService.userInterrupted = true;
            break;
          case "dtmf":
            const processedDTMF = dtmfHelper.processDTMF(parsedMessage.digit);
            llmService.streamChatCompletion([
              { role: "system", content: processedDTMF },
            ]);
            break;
          default:
            logger.warn(`Unknown message type: ${parsedMessage.type}`);
        }
      } catch (error) {
        logger.error(`Error parsing message: ${message}`, error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });

    ws.on("close", () => {
      logger.info("WebSocket connection closed");
    });

    llmService.on("chatCompletion:complete", (message: any) => {
      const textMessage = {
        type: "text",
        token: message.content,
        last: true,
      };
      ws.send(JSON.stringify(textMessage));
    });

    llmService.on("streamChatCompletion:partial", (content: any) => {
      const textMessage = {
        type: "text",
        token: content,
        last: false,
      };
      ws.send(JSON.stringify(textMessage));
    });

    llmService.on("streamChatCompletion:complete", (message: any) => {
      const textMessage = {
        type: "text",
        token: message,
        last: true,
      };
      ws.send(JSON.stringify(textMessage));
    });

    llmService.on("humanAgentHandoff", (message: any) => {
      const textMessage = {
        type: "text",
        token: message.response,
        last: true,
      };

      logger.info("Handoff Message", textMessage);
      ws.send(JSON.stringify(textMessage));

      const endMessage = {
        type: "end",
        handoffData: JSON.stringify(message.context), // important to stringify the object
      };

      ws.send(JSON.stringify(endMessage));
    });

    llmService.on("switchLanguage", (message: any) => {
      const languageCode =
        config.languages[message.targetLanguage]?.locale_code;
      if (!languageCode) {
        logger.info("Language not supported", message.targetLanguage);
        return;
      }

      const languageMessage = {
        type: "language",
        ttsLanguage: languageCode,
        transcriptionLanguage: languageCode,
      };

      logger.info("Switch Language", message.targetLanguage);
      ws.send(JSON.stringify(languageMessage));
    });
  });
}
