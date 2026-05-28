// Hover provider for SX.
//
// Shows opcode metadata (hex/decimal opcodeNum, input/output desc,
// description) when the cursor is over an opcode token.
//
// Ported from `tm/src/vscode/provideHover.js` (CommonJS).

const opcodes = require("./opcodes");

function buildIndex() {
  const idx = new Map();
  for (const op of opcodes) {
    if (!op || !op.value) continue;
    const full = String(op.value).toLowerCase();
    idx.set(full, op);
    const short = full.replace(/^op_/, "");
    if (short && !idx.has(short)) idx.set(short, op);
  }
  return idx;
}

const HOVER_INDEX = buildIndex();

function formatOp(op) {
  const lines = [];
  lines.push(`**${op.value}**`);
  const num = op.opcodeNum;
  if (num !== undefined && num !== null) {
    const numStr = typeof num === "number"
      ? `0x${num.toString(16).padStart(2, "0")} (${num})`
      : String(num);
    lines.push(`opcode: ${numStr}`);
  }
  if (op.inputDesc) lines.push(`input: \`${op.inputDesc}\``);
  if (op.outputDesc) lines.push(`output: \`${op.outputDesc}\``);
  if (op.description) lines.push("", op.description);
  if (op.disabled) lines.push("", "_(disabled)_");
  return lines.join("\n");
}

function lookup(word) {
  if (!word) return null;
  return HOVER_INDEX.get(word.toLowerCase()) || null;
}

function createHoverProvider(vscode) {
  return {
    provideHover(document, position /* , token */) {
      const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/);
      if (!wordRange) return null;
      const word = document.getText(wordRange);
      const op = lookup(word);
      if (!op) return null;
      const md = new vscode.MarkdownString(formatOp(op));
      md.isTrusted = false;
      return new vscode.Hover(md, wordRange);
    },
  };
}

module.exports = {
  lookup,
  formatOp,
  createHoverProvider,
};
