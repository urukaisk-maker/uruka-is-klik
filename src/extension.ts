import * as vscode from "vscode";
import { InlineCompletionProvider } from "./providers/InlineCompletionProvider";
import { ChatViewProvider } from "./providers/ChatViewProvider";
import { registerCommands } from "./commands";
import { logger } from "./utils/logger";
import { UrukaisClient } from "./client/UrukaisClient";

export async function activate(context: vscode.ExtensionContext) {
  logger.init();
  logger.info("Urukais KLick activado");

  // 1. Inline completions (ghost text)
  context.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      { pattern: "**" },
      new InlineCompletionProvider()
    )
  );

  // 2. Chat panel (webview)
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatViewProvider.viewType,
      new ChatViewProvider(context.extensionUri)
    )
  );

  // 3. Comandos de la paleta
  registerCommands(context);

  // 4. Precalentamiento del modelo en segundo plano
  const client = new UrukaisClient();
  client
    .warmup()
    .then(() => logger.info("Warmup completado"))
    .catch((err) => logger.error("Warmup falló", err));

  logger.info("Urukais KLick listo");
}

export function deactivate() {
  logger.dispose();
}
