// SX snippets — ported from tm/src/vscode/snippets.js.
//
// In VS Code we use SnippetString syntax ($0 final cursor, $1/$2 tab stops).
// Each entry: label, body (string with snippet placeholders), documentation.

const snippets = [
  {
    label: "if",
    body: ["if", "\t$0", "endif"].join("\n"),
    documentation: "If statement",
  },
  {
    label: "ifelse",
    body: ["if", "\t$1", "else", "\t$0", "endif"].join("\n"),
    documentation: "If/else statement",
  },
  {
    label: "notIf",
    body: ["notIf", "\t$0", "endif"].join("\n"),
    documentation: "NotIf statement",
  },
  {
    label: "notifelse",
    body: ["notIf", "\t$1", "else", "\t$0", "endif"].join("\n"),
    documentation: "NotIf/else statement",
  },
  {
    label: "verif",
    body: ["verIf", "\t$0", "endif"].join("\n"),
    documentation: "VerIf block (reserved)",
  },
  {
    label: "vernotif",
    body: ["verNotif", "\t$0", "endif"].join("\n"),
    documentation: "VerNotif block (reserved)",
  },
  {
    label: "repeat",
    body: ["repeat", "\t$0", "end"].join("\n"),
    documentation: "Repeat block",
  },
  {
    label: "section",
    body: ["@section:'$1'", "\t$0", "!"].join("\n"),
    documentation: "Foldable @section block",
  },
];

module.exports = { snippets };
