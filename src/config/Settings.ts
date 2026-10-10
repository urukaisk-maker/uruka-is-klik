import * as vscode from "vscode";

export interface UrukaisSettings {
  serverUrl: string;
  model: string;
  apiKey: string;
  inlineCompletion: {
    enabled: boolean;
    debounceMs: number;
    maxTokens: number;
    temperature: number;
    topP: number;
    minP: number;
    repetitionPenalty: number;
  };
}

export class Settings {
  static get(): UrukaisSettings {
    const cfg = vscode.workspace.getConfiguration("uruka-is-klik");
    return {
      serverUrl: cfg.get<string>("serverUrl", "http://localhost:8080/v1"),
      model: cfg.get<string>("model", "MiniCPM5-2B"),
      apiKey: cfg.get<string>("apiKey", "EMPTY"),
      inlineCompletion: {
        enabled: cfg.get<boolean>("inlineCompletion.enabled", true),
        debounceMs: cfg.get<number>("inlineCompletion.debounceMs", 500),
        maxTokens: cfg.get<number>("inlineCompletion.maxTokens", 96),
        temperature: cfg.get<number>("inlineCompletion.temperature", 1.0),
        topP: cfg.get<number>("inlineCompletion.topP", 0.95),
        minP: cfg.get<number>("inlineCompletion.minP", 0.0),
        repetitionPenalty: cfg.get<number>("inlineCompletion.repetitionPenalty", 1.05),
      },
    };
  }
}
