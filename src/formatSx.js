// formatSx — whole-document formatter for .sx / .sxLib.
//
// Pure: string in → string out. Ported from `tm/src/vscode/formatSx.js`.
//
// Rules:
//   1. Trim trailing whitespace from every line.
//   2. Convert leading tabs to 4 spaces.
//   3. Remove stray empty `//` comments.
//   4. Collapse 2+ consecutive blank lines to 1.
//   5. Normalise "// comment" spacing (space after // unless hex annotation).
//   6. Ensure file ends with exactly one newline.

function formatSx(text) {
  let lines = text.split("\n");

  lines = lines.map((line) => {
    const trimmed = line.replace(/[ \t]+$/, "");
    return trimmed.replace(/^\t+/, (match) => "    ".repeat(match.length));
  });

  lines = lines.map((line) => {
    if (/^\s*\/\/\s*$/.test(line)) return "";
    return line;
  });

  const collapsed = [];
  let prevBlank = false;
  for (const line of lines) {
    const isBlank = line === "";
    if (isBlank && prevBlank) continue;
    collapsed.push(line);
    prevBlank = isBlank;
  }
  lines = collapsed;

  lines = lines.map((line) => {
    return line.replace(/(\/\/)([^ /\n*])/, (match, slashes, firstChar) => {
      const idx = line.indexOf(match);
      const afterMatch = idx >= 0 ? line.slice(idx + match.length) : "";
      const next = afterMatch[0] || "";
      if (/^[a-f0-9]{2}/.test(firstChar + next)) return match;
      return slashes + " " + firstChar;
    });
  });

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.join("\n") + "\n";
}

function createDocumentFormattingProvider(vscode) {
  return {
    provideDocumentFormattingEdits(document) {
      const original = document.getText();
      const formatted = formatSx(original);
      if (formatted === original) return [];
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(original.length)
      );
      return [vscode.TextEdit.replace(fullRange, formatted)];
    },
  };
}

module.exports = {
  formatSx,
  createDocumentFormattingProvider,
};
