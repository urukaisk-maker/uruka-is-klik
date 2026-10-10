import * as vscode from "vscode";

let channel: vscode.OutputChannel | undefined;

export const logger = {
  init() {
    channel = vscode.window.createOutputChannel("Urukais KLick");
  },
  info(msg: string) {
    channel?.appendLine(`[INFO] ${new Date().toISOString()} ${msg}`);
  },
  error(msg: string, err?: unknown) {
    const detail = err instanceof Error ? ` — ${err.message}` : "";
    channel?.appendLine(`[ERROR] ${new Date().toISOString()} ${msg}${detail}`);
  },
  dispose() {
    channel?.dispose();
  },
};
