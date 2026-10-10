import * as vscode from "vscode";
import { UrukaisClient } from "../client/UrukaisClient";
import { logger } from "../utils/logger";

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "uruka-is-klik.chatView";
  private client = new UrukaisClient();

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this.getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === "chat") {
        try {
          const reply = await this.client.chat([
            { role: "system", content: "Eres un asistente de código conciso." },
            { role: "user", content: msg.text },
          ]);
          webviewView.webview.postMessage({ type: "reply", text: reply });
        } catch (err) {
          logger.error("Chat falló", err);
          webviewView.webview.postMessage({
            type: "reply",
            text: "Error al contactar con el servidor local.",
          });
        }
      }
    });
  }

  private getHtml(): string {
    return /* html */ `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  body { font-family: var(--vscode-font-family); padding: 8px; color: var(--vscode-foreground); }
  #log { min-height: 200px; margin-bottom: 8px; white-space: pre-wrap; }
  #input { width: 100%; padding: 6px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
  .user { color: var(--vscode-textLink-foreground); }
  .bot { color: var(--vscode-foreground); }
</style></head><body>
  <div id="log"></div>
  <textarea id="input" rows="3" placeholder="Escribe y pulsa Enter…"></textarea>
  <script>
    const vscode = acquireVsCodeApi();
    const log = document.getElementById('log');
    const input = document.getElementById('input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        log.innerHTML += '<div class="user">▸ ' + text + '</div>';
        vscode.postMessage({ type: 'chat', text });
        input.value = '';
      }
    });
    window.addEventListener('message', e => {
      if (e.data.type === 'reply') {
        log.innerHTML += '<div class="bot">◂ ' + e.data.text + '</div>';
      }
    });
  </script>
</body></html>`;
  }
}
