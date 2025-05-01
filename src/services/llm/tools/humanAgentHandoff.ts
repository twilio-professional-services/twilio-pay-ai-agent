export interface HumanAgentHandoffParams {
  reason: string;
  context: string;
  response: string;
}

export async function humanAgentHandoff(params: HumanAgentHandoffParams): Promise<string> {

  return `The call has been handed off to a human agent. Reason: ${params.reason}. Context: ${params.context}. Response: ${params.response}`;
}