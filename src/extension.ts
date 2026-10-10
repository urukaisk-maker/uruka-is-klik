import * as vscode from "vscode";
import { InlineCompletionProvider } from "./providers/InlineCompletionProvider";
import { ChatViewProvider } from "./providers/ChatViewProvider";
import { registerCommands } from "./commands";
import { logger } from "./utils/logger";

export function activate(context: vscode.ExtensionContext) {
  logger.init();
  logger.info("Urukais KLick activado");

  context.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      { pattern: "**" },
      new InlineCompletionProvider()
    )
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatViewProvider.viewType,
      new ChatViewProvider(context.extensionUri)
    )
  );

  registerCommands(context);
  logger.info("Urukais KLick listo");
}

export function deactivate() {
  logger.dispose();
}
