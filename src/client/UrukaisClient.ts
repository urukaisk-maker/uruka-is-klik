import OpenAI from "openai";
import { Settings } from "../config/Settings";
import { ChatMessage } from "./types";
import { getLanguagePrompt } from "../context/LanguagePrompts";

export class UrukaisClient {
  private client: OpenAI;
  private model: string;

  constructor() {
    const settings = Settings.get();
    this.client = new OpenAI({
      baseURL: settings.serverUrl,
      apiKey: settings.apiKey || "EMPTY",
    });
    this.model = settings.model;
  }

  /**
   * Autocompletado inline. Devuelve SIEMPRE un string (puede estar vacío).
   */
  async inlineComplete(
    prefix: string,
    suffix: string,
    languageId: string,
    maxTokensOverride?: number
  ): Promise<string> {
    const settings = Settings.get();
    const prompt = this.buildInlinePrompt(prefix, suffix, languageId);
    const languagePrompt = getLanguagePrompt(languageId);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: languagePrompt.instruction },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokensOverride ?? settings.inlineCompletion.maxTokens,
      temperature: settings.inlineCompletion.temperature,
      top_p: settings.inlineCompletion.topP,
      // @ts-ignore
      extra_body: {
        min_p: settings.inlineCompletion.minP,
        repetition_penalty: settings.inlineCompletion.repetitionPenalty,
        chat_template_kwargs: { enable_thinking: false },
      },
      stop: languagePrompt.stopTokens ?? ["```"],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    return this.cleanCompletion(raw);
  }

  /**
   * Chat general. Thinking activado (útil para explicar/refactorizar).
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 1.0,
      top_p: 0.95,
      // @ts-ignore
      extra_body: { min_p: 0.0, repetition_penalty: 1.05 },
    });
    return response.choices[0]?.message?.content ?? "";
  }

  /**
   * Ping trivial para precalentar el modelo. Ignora el resultado.
   */
  async warmup(): Promise<void> {
    try {
      await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: "hola" }],
        max_tokens: 1,
        // @ts-ignore
        extra_body: {
          min_p: 0.0,
          chat_template_kwargs: { enable_thinking: false },
        },
      });
    } catch {
      // Silencioso: si falla, la primera petición real lo detectará.
    }
  }

  private buildInlinePrompt(
    prefix: string,
    suffix: string,
    languageId: string
  ): string {
    const recentPrefix = prefix.split("\n").slice(-60).join("\n");
    const recentSuffix = suffix.split("\n").slice(0, 15).join("\n");

    return [
      `Lenguaje: ${languageId}`,
      ``,
      `<prefix>`,
      recentPrefix,
      `</prefix>`,
      ``,
      `<fim>`,
      recentSuffix,
      `</suffix>`,
      ``,
      `Código a insertar en <fim>:`,
    ].join("\n");
  }

  private cleanCompletion(raw: string): string {
    let out = raw.trim();
    out = out.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    out = out.replace(/^Código a insertar[^\n]*\n?/i, "");
    return out.trim();
  }
}
