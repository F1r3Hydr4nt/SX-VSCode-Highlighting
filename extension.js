// SX VS Code extension entry point.
//
// Registers:
//   - FoldingRangeProvider          (@section / @s / repeat / #function / /* */)
//   - HoverProvider                  (opcode metadata)
//   - CompletionItemProvider         (keywords, opcodes, .args, snippets)
//   - DocumentFormattingEditProvider (whole-document formatSx)
//   - Commands: sx.formatDocument, sx.modifyStackIndices,
//                sx.stackIdxsBumpUp, sx.stackIdxsBumpDown
//
// All providers/commands are scoped to `language: sx`.

const vscode = require("vscode");

const { createFoldingRangeProvider } = require("./src/provideFoldingRanges");
const { createHoverProvider } = require("./src/provideHover");
const { createCompletionItemProvider } = require("./src/provideCompletionItems");
const {
  formatSx,
  createDocumentFormattingProvider,
} = require("./src/formatSx");
const { transformStackIdxs } = require("./src/stackIdxTransform");

const SX_SELECTOR = { language: "sx" };

function applyStackTransform(editor, delta, threshold) {
  if (!editor) return;
  const sel = editor.selection;
  const range = !sel || sel.isEmpty
    ? new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length)
      )
    : new vscode.Range(sel.start, sel.end);
  const before = editor.document.getText(range);
  const after = transformStackIdxs(before, delta, threshold);
  if (after === before) return;
  editor.edit((eb) => eb.replace(range, after));
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      SX_SELECTOR,
      createFoldingRangeProvider(vscode)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      SX_SELECTOR,
      createHoverProvider(vscode)
    )
  );

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      SX_SELECTOR,
      createCompletionItemProvider(vscode),
      ".",
      "@",
      "#"
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      SX_SELECTOR,
      createDocumentFormattingProvider(vscode)
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sx.formatDocument", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const doc = editor.document;
      const original = doc.getText();
      const formatted = formatSx(original);
      if (formatted === original) return;
      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(original.length)
      );
      await editor.edit((eb) => eb.replace(fullRange, formatted));
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sx.modifyStackIndices", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const thresholdStr = await vscode.window.showInputBox({
        prompt: "Modify pick/roll indices >= threshold",
        value: "0",
        validateInput: (v) =>
          /^-?\d+$/.test(v.trim()) ? null : "Enter an integer",
      });
      if (thresholdStr === undefined) return;
      const deltaStr = await vscode.window.showInputBox({
        prompt: "Delta to add (e.g. 1, -2)",
        value: "1",
        validateInput: (v) =>
          /^-?\d+$/.test(v.trim()) ? null : "Enter a signed integer",
      });
      if (deltaStr === undefined) return;
      applyStackTransform(
        editor,
        parseInt(deltaStr.trim(), 10),
        parseInt(thresholdStr.trim(), 10)
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sx.stackIdxsBumpUp", () => {
      applyStackTransform(vscode.window.activeTextEditor, +1, 0);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("sx.stackIdxsBumpDown", () => {
      applyStackTransform(vscode.window.activeTextEditor, -1, 0);
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
