import OpenAI from "openai";
import { Settings } from "../config/Settings";
import { ChatMessage } from "./types";

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
   * Autocompletado inline: envía prefijo + sufijo y devuelve solo la parte nueva.
   * Usa enable_thinking=false para que el modelo no malgaste tokens razonando.
   */
  async inlineComplete(
    prefix: string,
    suffix: string,
    languageId: string
  ): Promise<string> {
    const settings = Settings.get();
    const prompt = this.buildInlinePrompt(prefix, suffix, languageId);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: settings.inlineCompletion.maxTokens,
      temperature: settings.inlineCompletion.temperature,
      top_p: settings.inlineCompletion.topP,
      // @ts-ignore — extra_body para llama.cpp / vLLM / SGLang
      extra_body: {
        min_p: settings.inlineCompletion.minP,
        repetition_penalty: settings.inlineCompletion.repetitionPenalty,
        chat_template_kwargs: { enable_thinking: false },
      },
      stop: ["```"],
    });

    const raw = response.choices[0]?.message?.content ?? "";
    return this.cleanCompletion(raw);
  }

  /**
   * Chat general (para panel de chat y comandos).
   * Aquí SÍ dejamos thinking activado: ayuda en tareas de explicar/refactorizar.
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
   * Construye el prompt FIM (fill-in-the-middle) para autocompletado.
   */
  private buildInlinePrompt(
    prefix: string,
    suffix: string,
    languageId: string
  ): string {
    const recentPrefix = prefix.split("\n").slice(-60).join("\n");
    const recentSuffix = suffix.split("\n").slice(0, 15).join("\n");

    return [
      `Lenguaje: ${languageId}`,
      `Completa el código que falta en el marcador <fim>.`,
      `Responde SOLO con el código, sin explicaciones, sin markdown, sin fences.`,
      ``,
      `<prefix>`,
      recentPrefix,
      `</prefix>`,
      ``,
      `<fim>`,
      recentSuffix,
      `</suffix>`,
      ``,
      `Código a insertar (solo el código):`,
    ].join("\n");
  }

  private cleanCompletion(raw: string): string {
    let out = raw.trim();
    out = out.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
    out = out.replace(/^Código a insertar[^\n]*\n?/i, "");
    return out.trim();
  }
}
