import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

type PaymentState = 'initialize' | 'collectCardNumber' | 'collectExpirationDate' | 'collectSecurityCode' | 'complete';
interface StatePrompts {
  [key in PaymentState]: string;
}

const prompts: StatePrompts = {
  initialize: 'Initializing payment process...',
  collectCardNumber: 'Please provide your 16-digit card number.',
  collectExpirationDate: 'Enter the card expiration date in MM/YY format.',
  collectSecurityCode: 'Provide the 3 or 4-digit security code from your card.',
  complete: 'Payment process is complete. Thank you!',
};

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is set
  })
);

async function getPromptForState(state: PaymentState): Promise<string> {
  const systemMessage: ChatCompletionRequestMessage = {
    role: 'system',
    content: 'You are a helpful assistant guiding users through a payment process.',
  };

  const userMessage: ChatCompletionRequestMessage = {
    role: 'user',
    content: prompts[state],
  };

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [systemMessage, userMessage],
    max_tokens: 50,
  });

  return response.data.choices[0]?.message?.content || prompts[state];
}
interface PaymentAgentState {
  currentState: PaymentState;
  stepsCompleted: PaymentState[];
  stepsRemaining: PaymentState[];
}

class PaymentAgent {
  private state: PaymentAgentState;

  constructor() {
    this.state = {
      currentState: 'initialize',
      stepsCompleted: [],
      stepsRemaining: ['collectCardNumber', 'collectExpirationDate', 'collectSecurityCode', 'complete'],
    };
  }

  private updateState(newState: PaymentState) {
    if (!this.state.stepsRemaining.includes(newState)) {
      throw new Error(`Invalid state transition to ${newState}`);
    }

    this.state.stepsCompleted.push(this.state.currentState);
    this.state.stepsRemaining = this.state.stepsRemaining.filter((step) => step !== newState);
    this.state.currentState = newState;
  }

  public initialize() {
    if (this.state.currentState !== 'initialize') {
      throw new Error('PaymentAgent is already initialized.');
    }
    this.updateState('collectCardNumber');
  }

  public collectCardNumber(cardNumber: string) {
    if (this.state.currentState !== 'collectCardNumber') {
      throw new Error('Invalid state: Expected to collect card number.');
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      throw new Error('Invalid card number format.');
    }
    this.updateState('collectExpirationDate');
  }

  public collectExpirationDate(expirationDate: string) {
    if (this.state.currentState !== 'collectExpirationDate') {
      throw new Error('Invalid state: Expected to collect expiration date.');
    }
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      throw new Error('Invalid expiration date format. Use MM/YY.');
    }
    this.updateState('collectSecurityCode');
  }

  public collectSecurityCode(securityCode: string) {
    if (this.state.currentState !== 'collectSecurityCode') {
      throw new Error('Invalid state: Expected to collect security code.');
    }
    if (!/^\d{3,4}$/.test(securityCode)) {
      throw new Error('Invalid security code format.');
    }
    this.updateState('complete');
  }

  public getState() {
    return this.state;
  }
}

export default PaymentAgent;