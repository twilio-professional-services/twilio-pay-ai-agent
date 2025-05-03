import {
  VERIFY_USER,
  CHECK_PENDING_BILL,
  START_PAYMENT,
  CAPTURE_PAYMENT_CARD_NUMBER,
  CAPTURE_SECURITY_CODE,
  CAPTURE_EXPIRATION_DATE,
  COMPLETE_PAYMENT_PROCESSING,
  HUMAN_AGENT_HANDOFF,
  CANCEL_PAYMENT_PROCESSING,
} from "./toolConstants";

export interface LLMToolDefinition {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export const toolDefinitions : LLMToolDefinition[] = [
  
    {
      type: 'function',
      function: {
        name: VERIFY_USER,
        description: 'Verify the identity of a user',
        parameters: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'First name of the user',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the user',
            },
            DOB: {
              type: 'string',
              description: 'Date of birth of the user. Format: YYYY-MM-DD',
            },
          },
          required: ['firstName', 'lastName', 'DOB'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: CHECK_PENDING_BILL,
        description: 'Get the current balance due for a verified user',
        parameters: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: `The user ID. Note: This is verified user id from the ${VERIFY_USER} function`,
            },
          },
          required: ['userId'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: START_PAYMENT,
        description: 'Initiate the payment process for the specified amount',
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session. This is used to start the payment session',
            },
            amount: {
              type: 'number',
              description: 'The amount to be paid',
            },
          },
          required: ['userId', 'amount'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: CAPTURE_PAYMENT_CARD_NUMBER,
        description: 'Capture the payment card number from the user',
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session.',
            },
            paymentSid: {
              type: 'string',
              description: 'The payment SID for the session.',
            },
          },
          required: ['callSid', 'paymentSid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: CAPTURE_SECURITY_CODE,
        description: 'Capture the security code from the user',
  
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session.',
            },
            paymentSid: {
              type: 'string',
              description: 'The payment SID for the session.',
            },
          },
          required: ['callSid', 'paymentSid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: CAPTURE_EXPIRATION_DATE,
        description: 'Capture the expiration date from the user',
  
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session.',
            },
            paymentSid: {
              type: 'string',
              description: 'The payment SID for the session.',
            },
          },
          required: ['callSid', 'paymentSid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: COMPLETE_PAYMENT_PROCESSING,
        description: 'Complete the payment processing for the session',
  
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session.',
            },
            paymentSid: {
              type: 'string',
              description: 'The payment SID for the session.',
            },
          },
          required: ['callSid', 'paymentSid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: CANCEL_PAYMENT_PROCESSING,
        description: 'Cancel the payment processing for the session',
        parameters: {
          type: 'object',
          properties: {
            callSid: {
              type: 'string',
              description: 'The call SID for the session.',
            },
            paymentSid: {
              type: 'string',
              description: 'The payment SID for the session.',
            },
          },
          required: ['callSid', 'paymentSid'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: HUMAN_AGENT_HANDOFF,
        description: 'Transfers the customer to a live agent in case they request help from a real person.',
        parameters: {
          type: "object",
          properties: {
            reason: {
              type: "string",
              description:
                "The reason for the handoff, such as user request, legal issue, financial matter, or other sensitive topics.",
            },
            context: {
              type: "string",
              description:
                "Any relevant conversation context or details leading to the handoff.",
            },
            response: {
              type: "string",
              description:
                "The response to the user letting them know they are being transferred to a live agent.",
            }
          },
          required: ["reason", "context", "response"],
        }
      },
    },
  ];
