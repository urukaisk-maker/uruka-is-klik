import * as vscode from "vscode";
import { UrukaisClient } from "../client/UrukaisClient";
import { Settings } from "../config/Settings";
import { ContextBuilder } from "../context/ContextBuilder";
import { logger } from "../utils/logger";

export class InlineCompletionProvider
  implements vscode.InlineCompletionItemProvider
{
  private client = new UrukaisClient();
  private lastRequest = 0;

  async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionItem[]> {
    const settings = Settings.get();
    if (!settings.inlineCompletion.enabled) return [];

    // Throttle mínimo entre peticiones para no saturar la CPU
    const now = Date.now();
    if (now - this.lastRequest < settings.inlineCompletion.debounceMs) {
      return [];
    }
    this.lastRequest = now;

    const { prefix, suffix } = ContextBuilder.getPrefixAndSuffix(
      document,
      position
    );

    try {
      const completion = await this.client.inlineComplete(
        prefix,
        suffix,
        document.languageId
      );
      if (!completion || token.isCancellationRequested) return [];

      return [
        new vscode.InlineCompletionItem(
          completion,
          new vscode.Range(position, position)
        ),
      ];
    } catch (err) {
      logger.error("Inline completion falló", err);
      return [];
    }
  }
}
