import type OpenAI from "openai";

export type ChatMessage = OpenAI.ChatCompletionMessageParam;

export interface CompletionRequest {
  prefix: string;
  suffix: string;
  languageId: string;
}
