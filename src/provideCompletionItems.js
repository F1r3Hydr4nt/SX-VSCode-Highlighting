// Completion provider for SX.
//
// Surfaces:
//   - keywords (import, repeat, break, end)
//   - opcodes (short form, e.g. dup, hash256, checkSig)
//   - .arg context vars (.ctx, .pubKey, etc.)
//   - if/ifelse/notif/verif/repeat/section snippets
//
// Ported from `tm/src/vscode/provideCompletionItems.js` + `snippets.js`.

const { shortOps } = require("./opcodes");
const { snippets } = require("./snippets");

const KEYWORDS = ["import", "repeat", "break", "end"];

const STDLIB_FUNCS = [
  "verifyCtx",
  "autoSlice",
  "toLEU",
  "fromLEU",
  "splitCtx",
  "checkCtx",
  "copyTopAlt",
];

const COMMON_ARGS = [
  "balance",
  "ctx",
  "ctxAll",
  "ctxAllACP",
  "ctxNone",
  "ctxNoneACP",
  "ctxSingle",
  "ctxSingleACP",
  "inputIndexN",
  "mintData",
  "miscData",
  "nextBalanceCommit",
  "nextTxoType",
  "outpoint",
  "output",
  "outputIndexN",
  "pubKey",
  "pubKeyHash",
  "sigAll",
  "sigAllACP",
  "sigNone",
  "sigNoneACP",
  "sigSingle",
  "sigSingleACP",
  "tx",
  "txHash",
  "txid",
  "txoType",
  "voutIdx",
];

function createCompletionItemProvider(vscode) {
  return {
    provideCompletionItems(/* document, position, token, context */) {
      const items = [];

      for (const kw of KEYWORDS) {
        const it = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
        items.push(it);
      }

      for (const fn of STDLIB_FUNCS) {
        const it = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
        it.detail = "SX stdlib";
        items.push(it);
      }

      for (const op of shortOps) {
        if (!op || !op.value) continue;
        const it = new vscode.CompletionItem(op.value, vscode.CompletionItemKind.Keyword);
        if (op.description) it.documentation = new vscode.MarkdownString(op.description);
        if (op.opcodeNum !== undefined) {
          const n = typeof op.opcodeNum === "number"
            ? `0x${op.opcodeNum.toString(16).padStart(2, "0")} (${op.opcodeNum})`
            : String(op.opcodeNum);
          it.detail = `opcode ${n}`;
        }
        items.push(it);
      }

      for (const arg of COMMON_ARGS) {
        const it = new vscode.CompletionItem(`.${arg}`, vscode.CompletionItemKind.Variable);
        it.insertText = `.${arg}`;
        items.push(it);
      }

      for (const sn of snippets) {
        const it = new vscode.CompletionItem(sn.label, vscode.CompletionItemKind.Snippet);
        it.insertText = new vscode.SnippetString(sn.body);
        if (sn.documentation) it.documentation = sn.documentation;
        items.push(it);
      }

      return items;
    },
  };
}

module.exports = {
  KEYWORDS,
  STDLIB_FUNCS,
  COMMON_ARGS,
  createCompletionItemProvider,
};
