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

  // Cuántos caracteres de contexto ya enviados al servidor (para el log)
  async provideInlineCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.InlineCompletionContext,
    token: vscode.CancellationToken
  ): Promise<vscode.InlineCompletionItem[]> {
    const settings = Settings.get();
    if (!settings.inlineCompletion.enabled) return [];

    // Throttle: no más de una petición cada debounceMs
    const now = Date.now();
    if (now - this.lastRequest < settings.inlineCompletion.debounceMs) {
      return [];
    }
    this.lastRequest = now;

    const { prefix, suffix } = ContextBuilder.getPrefixAndSuffix(
      document,
      position
    );

    // Ignora si el usuario está en medio de un token (evita llamadas inútiles)
    const line = document.lineAt(position.line).text;
    const charBefore = position.character > 0 ? line[position.character - 1] : "";
    const isMidWord = /[\w$]/.test(charBefore);

    try {
      // Petición rápida: pocos tokens, respuesta veloz.
      const fastMax = isMidWord ? 16 : 40;
      const fast = await this.client.inlineComplete(
        prefix,
        suffix,
        document.languageId,
        fastMax
      );
      if (!fast || token.isCancellationRequested) return [];

      const items: vscode.InlineCompletionItem[] = [
        new vscode.InlineCompletionItem(
          fast,
          new vscode.Range(position, position)
        ),
      ];

      // Segunda variante más larga solo si la primera fue corta (probablemente
      // incompleta) y el usuario no está a mitad de palabra.
      if (!isMidWord && fast.length < 80) {
        try {
          const long = await this.client.inlineComplete(
            prefix,
            suffix,
            document.languageId,
            settings.inlineCompletion.maxTokens
          );
          if (long && long !== fast && !token.isCancellationRequested) {
            items.push(
              new vscode.InlineCompletionItem(
                long,
                new vscode.Range(position, position)
              )
            );
          }
        } catch {
          // Si la segunda falla, seguimos con la primera
        }
      }

      return items;
    } catch (err) {
      logger.error("Inline completion falló", err);
      return [];
    }
  }
}
