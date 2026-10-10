import * as vscode from "vscode";
import { UrukaisClient } from "../client/UrukaisClient";

const client = new UrukaisClient();

async function askWithSelection(promptPrefix: string): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const selection = editor.selection;
  const text = editor.document.getText(selection);
  if (!text) {
    vscode.window.showWarningMessage("Urukais: selecciona código primero.");
    return;
  }

  const reply = await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "Urukais pensando…" },
    () =>
      client.chat([
        { role: "system", content: "Eres un asistente de código." },
        { role: "user", content: `${promptPrefix}\n\n\`\`\`\n${text}\n\`\`\`` },
      ])
  );

  const doc = await vscode.workspace.openTextDocument({
    content: reply,
    language: "markdown",
  });
  await vscode.window.showTextDocument(doc, { preview: true });
}

export function registerCommands(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("uruka-is-klik.explain", () =>
      askWithSelection("Explica este código:")
    ),
    vscode.commands.registerCommand("uruka-is-klik.refactor", () =>
      askWithSelection("Refactoriza este código y explica los cambios:")
    ),
    vscode.commands.registerCommand("uruka-is-klik.fix", () =>
      askWithSelection("Encuentra y corrige el error en este código:")
    ),
    vscode.commands.registerCommand("uruka-is-klik.openChat", () =>
      vscode.commands.executeCommand("workbench.view.extension.uruka-is-klik")
    )
  );
}
