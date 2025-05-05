import { config } from "../../../config";
import logger from "../../../utils/logger";

export interface switchLanguageParams {
  targetLanguage: string;
}

export async function switchLanguage(params: switchLanguageParams): Promise<string> {

  logger.info("Switch Language params", { params });

  if (params.targetLanguage in config.languages) {
    return `Language switched to ${params.targetLanguage}`;
  }
  else {
    return "Language not supported";
  }
}