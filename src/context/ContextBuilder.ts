import * as vscode from "vscode";

export class ContextBuilder {
  static getPrefixAndSuffix(
    document: vscode.TextDocument,
    position: vscode.Position
  ): { prefix: string; suffix: string } {
    const fullText = document.getText();
    const offset = document.offsetAt(position);
    return {
      prefix: fullText.slice(0, offset),
      suffix: fullText.slice(offset),
    };
  }
}
